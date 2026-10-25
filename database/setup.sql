-- Run once in a new Supabase project. No student data is stored in GitHub.
begin;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create table public.teacher_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 100),
  school_name text not null default '' check (char_length(school_name) <= 120)
);
alter table public.teacher_profiles enable row level security;
revoke all on public.teacher_profiles from anon, authenticated;
grant select on public.teacher_profiles to authenticated;
create policy teacher_profile_self on public.teacher_profiles for select to authenticated using (id = (select auth.uid()));

create table public.letters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.teacher_profiles(id) on delete cascade,
  access_token uuid not null unique default gen_random_uuid(),
  first_name text not null check (char_length(trim(first_name)) between 1 and 50),
  father_name text not null default '' check (char_length(father_name) <= 80),
  grade text not null check (char_length(trim(grade)) between 1 and 60),
  message text not null check (char_length(trim(message)) between 1 and 1800),
  teacher_name text not null check (char_length(trim(teacher_name)) between 1 and 100),
  school_name text not null default '' check (char_length(school_name) <= 120),
  import_group text not null default '' check (char_length(import_group) <= 80),
  created_at timestamptz not null default now(),
  first_opened_at timestamptz,
  last_opened_at timestamptz,
  open_count integer not null default 0 check (open_count >= 0),
  loved_at timestamptz
);
create index letters_owner_created on public.letters(owner_id,created_at desc);
alter table public.letters enable row level security;
revoke all on public.letters from anon, authenticated;
grant select,delete on public.letters to authenticated;
grant insert(first_name,father_name,grade,message,teacher_name,school_name,import_group) on public.letters to authenticated;
grant update(first_name,father_name,grade,message,teacher_name,school_name,import_group) on public.letters to authenticated;
create policy letters_owner_select on public.letters for select to authenticated using (owner_id = (select auth.uid()));
create policy letters_owner_insert on public.letters for insert to authenticated with check (owner_id = (select auth.uid()) and exists(select 1 from public.teacher_profiles where id = (select auth.uid())));
create policy letters_owner_update on public.letters for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy letters_owner_delete on public.letters for delete to authenticated using (owner_id = (select auth.uid()));

create function private.normalize_name(p_name text) returns text language sql immutable strict set search_path = '' as $$
  select pg_catalog.regexp_replace(pg_catalog.translate(pg_catalog.lower(pg_catalog.btrim(p_name)), 'أإآٱىة', 'اااايه'), '[[:space:]ً-ٰٟـ]', '', 'g');
$$;
revoke all on function private.normalize_name(text) from public,anon,authenticated;

-- Secret random link + first name selects exactly one card. Father name and
-- owner identifiers are never returned. Only explicit opening calls this RPC.
create function private.open_letter(p_token uuid,p_name text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare card public.letters%rowtype;
begin
  if p_name is null or char_length(p_name)>100 then return null; end if;
  update public.letters set first_opened_at=coalesce(first_opened_at,now()),last_opened_at=now(),open_count=open_count+1
  where access_token=p_token and (private.normalize_name(first_name)=private.normalize_name(p_name) or private.normalize_name(pg_catalog.split_part(pg_catalog.btrim(first_name),' ',1))=private.normalize_name(p_name))
  returning * into card;
  if not found then return null; end if;
  return pg_catalog.jsonb_build_object('first_name',card.first_name,'grade',card.grade,'message',card.message,'teacher_name',card.teacher_name,'school_name',card.school_name,'loved_at',card.loved_at);
end;
$$;
revoke all on function private.open_letter(uuid,text) from public,anon,authenticated;
grant execute on function private.open_letter(uuid,text) to anon,authenticated;
create function public.open_letter(p_token uuid,p_name text) returns jsonb language sql security invoker set search_path = '' as $$select private.open_letter(p_token,p_name);$$;
revoke all on function public.open_letter(uuid,text) from public,anon,authenticated;
grant execute on function public.open_letter(uuid,text) to anon,authenticated;

create function private.love_letter(p_token uuid,p_name text) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if p_name is null or char_length(p_name)>100 then return false; end if;
  update public.letters set loved_at=coalesce(loved_at,now()) where access_token=p_token
  and first_opened_at is not null and (private.normalize_name(first_name)=private.normalize_name(p_name) or private.normalize_name(pg_catalog.split_part(pg_catalog.btrim(first_name),' ',1))=private.normalize_name(p_name));
  return found;
end;
$$;
revoke all on function private.love_letter(uuid,text) from public,anon,authenticated;
grant execute on function private.love_letter(uuid,text) to anon,authenticated;
create function public.love_letter(p_token uuid,p_name text) returns boolean language sql security invoker set search_path = '' as $$select private.love_letter(p_token,p_name);$$;
revoke all on function public.love_letter(uuid,text) from public,anon,authenticated;
grant execute on function public.love_letter(uuid,text) to anon,authenticated;

commit;

-- After creating the teacher in Authentication > Users, add their user ID:
-- insert into public.teacher_profiles(id,display_name,school_name)
-- values('PASTE_TEACHER_AUTH_USER_UUID','معلمتكِ …','اسم المدرسة');
-- Disable public sign-ups in Authentication settings. Do not expose the private schema.
