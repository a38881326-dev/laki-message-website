-- Upgrade: "bint / bin / ibn" in the rest of a name are optional when a student
-- types her name, so "Mais Mohammed" opens the letter of "Mais bint Mohammed ...".
begin;

create or replace function private.strip_lineage(p_text text) returns text
language sql immutable set search_path = '' as $$
  select pg_catalog.regexp_replace(pg_catalog.regexp_replace(' '||coalesce(p_text,'')||' ', U&' (\0628\0646\062A|\0627\0628\0646|\0628\0646) ', ' ', 'g'), U&' (\0628\0646\062A|\0627\0628\0646|\0628\0646) ', ' ', 'g');
$$;
revoke all on function private.strip_lineage(text) from public,anon,authenticated;

create or replace function private.name_matches(p_first text,p_father text,p_name text) returns boolean
language sql immutable set search_path = '' as $$
  select private.normalize_name(p_first)=private.normalize_name(p_name)
      or private.normalize_name(pg_catalog.split_part(pg_catalog.btrim(p_first),' ',1))=private.normalize_name(p_name)
      or private.normalize_name(p_first||p_father)=private.normalize_name(p_name)
      or (pg_catalog.char_length(private.normalize_name(p_name))>pg_catalog.char_length(private.normalize_name(p_first))
          and (pg_catalog.starts_with(private.normalize_name(p_first||p_father),private.normalize_name(p_name))
            or pg_catalog.starts_with(private.normalize_name(p_first||private.strip_lineage(p_father)),private.normalize_name(private.strip_lineage(p_name)))));
$$;

commit;
