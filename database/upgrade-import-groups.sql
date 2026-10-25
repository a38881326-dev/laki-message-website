-- Apply only if setup.sql was previously run before import groups were added.
begin;
alter table public.letters add column if not exists import_group text not null default '' check (char_length(import_group)<=80);
grant insert(import_group), update(import_group) on public.letters to authenticated;
create or replace function private.open_letter(p_token uuid,p_name text) returns jsonb
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
create or replace function private.love_letter(p_token uuid,p_name text) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if p_name is null or char_length(p_name)>100 then return false; end if;
  update public.letters set loved_at=coalesce(loved_at,now()) where access_token=p_token
  and first_opened_at is not null and (private.normalize_name(first_name)=private.normalize_name(p_name) or private.normalize_name(pg_catalog.split_part(pg_catalog.btrim(first_name),' ',1))=private.normalize_name(p_name));
  return found;
end;
$$;
commit;
