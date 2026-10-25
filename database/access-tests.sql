-- On a disposable Supabase test project after setup.sql. All fixtures roll back.
-- Run as postgres in SQL Editor, never as anon or a real teacher.
begin;
insert into auth.users(id) values
 ('10000000-0000-4000-8000-000000000001'),('10000000-0000-4000-8000-000000000002');
insert into public.teacher_profiles(id,display_name) values
 ('10000000-0000-4000-8000-000000000001','معلمة اختبار ١'),('10000000-0000-4000-8000-000000000002','معلمة اختبار ٢');
insert into public.letters(id,owner_id,access_token,first_name,father_name,grade,message,teacher_name) values
 ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001','أمل','اسم خاص','رابع','رسالة أولى','معلمة ١'),
 ('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000002','ريم','اسم خاص آخر','خامس','رسالة ثانية','معلمة ٢');

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000001',true);
do $$
declare n integer;
begin
 select count(*) into n from public.letters;
 if n<>1 then raise exception 'FAIL: teacher isolation'; end if;
 update public.letters set message='غير مسموح' where id='20000000-0000-4000-8000-000000000002';
 get diagnostics n=row_count;
 if n<>0 then raise exception 'FAIL: cross-teacher write'; end if;
 begin
   update public.letters set first_opened_at=now() where id='20000000-0000-4000-8000-000000000001';
   raise exception 'FAIL: teacher can forge tracking';
 exception when insufficient_privilege then null; end;
end $$;
reset role;

set local role anon;
do $$
declare card jsonb;
begin
 begin
   perform 1 from public.letters;
   raise exception 'FAIL: anonymous can list students';
 exception when insufficient_privilege then null; end;
 if public.open_letter('30000000-0000-4000-8000-000000000001','ريم') is not null then raise exception 'FAIL: wrong name'; end if;
 if public.open_letter('30000000-0000-4000-8000-000000000099','أمل') is not null then raise exception 'FAIL: wrong token'; end if;
 if public.love_letter('30000000-0000-4000-8000-000000000001','أمل') then raise exception 'FAIL: reaction before opening'; end if;
 card=public.open_letter('30000000-0000-4000-8000-000000000001','  امل ');
 if card is null or card->>'first_name'<>'أمل' then raise exception 'FAIL: normalized name'; end if;
 if card ? 'father_name' or card ? 'owner_id' or card ? 'access_token' then raise exception 'FAIL: private fields disclosed'; end if;
 if not public.love_letter('30000000-0000-4000-8000-000000000001','أمل') then raise exception 'FAIL: reaction'; end if;
 perform public.open_letter('30000000-0000-4000-8000-000000000001','أمل');
end $$;
reset role;
do $$
declare a public.letters%rowtype; b public.letters%rowtype;
begin
 select * into a from public.letters where id='20000000-0000-4000-8000-000000000001';
 select * into b from public.letters where id='20000000-0000-4000-8000-000000000002';
 if a.first_opened_at is null or a.open_count<>2 or a.loved_at is null then raise exception 'FAIL: tracking'; end if;
 if b.first_opened_at is not null or b.open_count<>0 then raise exception 'FAIL: unrelated letter tracking'; end if;
end $$;
rollback;
