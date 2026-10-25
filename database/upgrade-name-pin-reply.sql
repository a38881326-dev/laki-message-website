-- Upgrade: open a letter by name from the main page, optional 3-digit PIN for
-- private letters, and one short reply from the student. Run once after setup.sql.
begin;

alter table public.letters
  add column if not exists pin text check (pin is null or pin ~ '^[0-9]{3}$'),
  add column if not exists failed_pin_attempts integer not null default 0 check (failed_pin_attempts >= 0),
  add column if not exists reply text check (reply is null or char_length(btrim(reply)) between 1 and 500),
  add column if not exists replied_at timestamptz;
grant insert(pin) on public.letters to authenticated;
grant update(pin,failed_pin_attempts) on public.letters to authenticated;

-- Lenient names: alef forms, taa marbuta/haa, alef maqsura/yaa, hamza on waw/yaa
-- and a bare hamza (with or without it) all compare equal; diacritics and spaces ignored.
create or replace function private.normalize_name(p_name text) returns text language sql immutable strict set search_path = '' as $$
  select pg_catalog.regexp_replace(pg_catalog.translate(pg_catalog.lower(pg_catalog.btrim(p_name)), U&'\0623\0625\0622\0671\0649\0629\0624\0626', U&'\0627\0627\0627\0627\064A\0647\0648\064A'), U&'[[:space:]\064B-\065F\0670\0640\0621]', '', 'g');
$$;
revoke all on function private.normalize_name(text) from public,anon,authenticated;

create or replace function private.name_matches(p_first text,p_father text,p_name text) returns boolean
language sql immutable set search_path = '' as $$
  select private.normalize_name(p_first)=private.normalize_name(p_name)
      or private.normalize_name(pg_catalog.split_part(pg_catalog.btrim(p_first),' ',1))=private.normalize_name(p_name)
      or private.normalize_name(p_first||p_father)=private.normalize_name(p_name);
$$;
revoke all on function private.name_matches(text,text,text) from public,anon,authenticated;

-- Old per-letter links keep working, but never for PIN-protected letters.
create or replace function private.open_letter(p_token uuid,p_name text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare card public.letters%rowtype;
begin
  if p_name is null or char_length(p_name)>100 then return null; end if;
  update public.letters set first_opened_at=coalesce(first_opened_at,now()),last_opened_at=now(),open_count=open_count+1
  where access_token=p_token and pin is null and (private.normalize_name(first_name)=private.normalize_name(p_name) or private.normalize_name(pg_catalog.split_part(pg_catalog.btrim(first_name),' ',1))=private.normalize_name(p_name))
  returning * into card;
  if not found then return null; end if;
  return pg_catalog.jsonb_build_object('first_name',card.first_name,'grade',card.grade,'message',card.message,'teacher_name',card.teacher_name,'school_name',card.school_name,'loved_at',card.loved_at);
end;
$$;

-- Name (and PIN when set) selects the student's newest letter. Several different
-- students with the same name return 'ambiguous' so the page asks for the full name.
-- Ten wrong PINs lock the letter until the teacher saves it again.
create or replace function private.open_card(p_name text,p_pin text default null,p_token uuid default null) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare card public.letters%rowtype; students integer;
begin
  if p_name is null or char_length(p_name)>100 or private.normalize_name(p_name)='' then return pg_catalog.jsonb_build_object('status','not_found'); end if;
  if p_token is not null then
    select * into card from public.letters where access_token=p_token and private.name_matches(first_name,father_name,p_name);
    if not found then return pg_catalog.jsonb_build_object('status','not_found'); end if;
  else
    select count(distinct (private.normalize_name(first_name),private.normalize_name(father_name),private.normalize_name(grade))) into students
    from public.letters where private.name_matches(first_name,father_name,p_name);
    if students=0 then return pg_catalog.jsonb_build_object('status','not_found'); end if;
    if students>1 then return pg_catalog.jsonb_build_object('status','ambiguous'); end if;
    select * into card from public.letters where private.name_matches(first_name,father_name,p_name) order by created_at desc limit 1;
  end if;
  if card.pin is not null then
    if card.failed_pin_attempts>=10 then return pg_catalog.jsonb_build_object('status','locked'); end if;
    if p_pin is null or p_pin='' then return pg_catalog.jsonb_build_object('status','pin_required'); end if;
    if p_pin<>card.pin then
      update public.letters set failed_pin_attempts=failed_pin_attempts+1 where id=card.id;
      return pg_catalog.jsonb_build_object('status','wrong_pin');
    end if;
  end if;
  update public.letters set first_opened_at=coalesce(first_opened_at,now()),last_opened_at=now(),open_count=open_count+1,failed_pin_attempts=0
  where id=card.id returning * into card;
  return pg_catalog.jsonb_build_object('status','ok','letter',pg_catalog.jsonb_build_object('first_name',card.first_name,'grade',card.grade,'message',card.message,'teacher_name',card.teacher_name,'school_name',card.school_name,'loved_at',card.loved_at,'reply',card.reply,'access_token',card.access_token));
end;
$$;
revoke all on function private.open_card(text,text,uuid) from public,anon,authenticated;
grant execute on function private.open_card(text,text,uuid) to anon,authenticated;
create or replace function public.open_card(p_name text,p_pin text default null,p_token uuid default null) returns jsonb language sql security invoker set search_path = '' as $$select private.open_card(p_name,p_pin,p_token);$$;
revoke all on function public.open_card(text,text,uuid) from public,anon,authenticated;
grant execute on function public.open_card(text,text,uuid) to anon,authenticated;

-- One reply per letter, only after it was opened.
create or replace function private.reply_letter(p_token uuid,p_name text,p_reply text) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if p_name is null or char_length(p_name)>100 or p_reply is null or char_length(pg_catalog.btrim(p_reply)) not between 1 and 500 then return false; end if;
  update public.letters set reply=pg_catalog.btrim(p_reply),replied_at=now()
  where access_token=p_token and first_opened_at is not null and reply is null and private.name_matches(first_name,father_name,p_name);
  return found;
end;
$$;
revoke all on function private.reply_letter(uuid,text,text) from public,anon,authenticated;
grant execute on function private.reply_letter(uuid,text,text) to anon,authenticated;
create or replace function public.reply_letter(p_token uuid,p_name text,p_reply text) returns boolean language sql security invoker set search_path = '' as $$select private.reply_letter(p_token,p_name,p_reply);$$;
revoke all on function public.reply_letter(uuid,text,text) from public,anon,authenticated;
grant execute on function public.reply_letter(uuid,text,text) to anon,authenticated;

commit;
