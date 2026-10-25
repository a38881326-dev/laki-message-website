-- Upgrade: a class roster per teacher, so letters can be sent to any student,
-- class or hand-picked group. Full names are stored as first name + the rest.
begin;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.teacher_profiles(id) on delete cascade,
  first_name text not null check (char_length(btrim(first_name)) between 1 and 50),
  father_name text not null default '' check (char_length(father_name) <= 160),
  grade text not null check (char_length(btrim(grade)) between 1 and 60),
  created_at timestamptz not null default now(),
  unique (owner_id, first_name, father_name, grade)
);
create index if not exists students_owner_grade on public.students(owner_id, grade, first_name);
alter table public.students enable row level security;
revoke all on public.students from anon, authenticated;
grant select, delete on public.students to authenticated;
grant insert(first_name,father_name,grade) on public.students to authenticated;
grant update(first_name,father_name,grade) on public.students to authenticated;
create policy students_owner_select on public.students for select to authenticated using (owner_id = (select auth.uid()));
create policy students_owner_insert on public.students for insert to authenticated with check (owner_id = (select auth.uid()) and exists(select 1 from public.teacher_profiles where id = (select auth.uid())));
create policy students_owner_update on public.students for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy students_owner_delete on public.students for delete to authenticated using (owner_id = (select auth.uid()));

-- Letters can now carry the full rest of the name.
alter table public.letters drop constraint if exists letters_father_name_check;
alter table public.letters add constraint letters_father_name_check check (char_length(father_name) <= 160);

-- A student may type her first name, her full name, or the start of it
-- ("first + father"), which tells apart two students with the same first name.
create or replace function private.name_matches(p_first text,p_father text,p_name text) returns boolean
language sql immutable set search_path = '' as $$
  select private.normalize_name(p_first)=private.normalize_name(p_name)
      or private.normalize_name(pg_catalog.split_part(pg_catalog.btrim(p_first),' ',1))=private.normalize_name(p_name)
      or private.normalize_name(p_first||p_father)=private.normalize_name(p_name)
      or (pg_catalog.char_length(private.normalize_name(p_name))>pg_catalog.char_length(private.normalize_name(p_first))
          and pg_catalog.starts_with(private.normalize_name(p_first||p_father),private.normalize_name(p_name)));
$$;

commit;
