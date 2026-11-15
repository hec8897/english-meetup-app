-- 오늘(KST) 사용량을 원자적으로 1 증가. 상한(p_limit)에 이미 도달했으면 증가시키지 않고 false.
create or replace function public.bump_ai_usage(p_limit int)
returns boolean
language sql
security definer
set search_path = ''
as $$
  with bumped as (
    insert into public.ai_usage as u (day, count)
    select (now() at time zone 'Asia/Seoul')::date, 1
    where p_limit > 0
    on conflict (day) do update set count = u.count + 1
    where u.count < p_limit
    returning 1
  )
  select exists (select 1 from bumped);
$$;

revoke all on function public.bump_ai_usage(int) from public, anon, authenticated;
grant execute on function public.bump_ai_usage(int) to service_role;
