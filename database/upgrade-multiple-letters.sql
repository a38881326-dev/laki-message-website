-- Upgrade: several letters to the same student over time. The class is ignored
-- when telling students apart, and a missing father name never splits a student.
-- Each open shows her newest unopened letter, or her newest letter once all are opened.
begin;

create or replace function private.open_card(p_name text,p_pin text default null,p_token uuid default null) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare card public.letters%rowtype; fathers integer;
begin
  if p_name is null or char_length(p_name)>100 or private.normalize_name(p_name)='' then return pg_catalog.jsonb_build_object('status','not_found'); end if;
  if p_token is not null then
    select * into card from public.letters where access_token=p_token and private.name_matches(first_name,father_name,p_name);
    if not found then return pg_catalog.jsonb_build_object('status','not_found'); end if;
  else
    select count(distinct private.normalize_name(father_name)) filter (where private.normalize_name(father_name)<>'') into fathers
    from public.letters where private.name_matches(first_name,father_name,p_name);
    if fathers>1 then return pg_catalog.jsonb_build_object('status','ambiguous'); end if;
    select * into card from public.letters where private.name_matches(first_name,father_name,p_name)
    order by (first_opened_at is null) desc, created_at desc limit 1;
    if not found then return pg_catalog.jsonb_build_object('status','not_found'); end if;
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

commit;
