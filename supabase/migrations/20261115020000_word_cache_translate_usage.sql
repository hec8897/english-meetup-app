-- 단어 뜻 캐시(GCP Translation 결과). word는 정규화된 소문자.
create table public.word_cache (
  word text primary key,
  ko text not null,
  created_at timestamptz not null default now()
);

-- GCP Translation 일일 문자 수 카운터(비용 가드).
create table public.translate_usage (
  day date primary key,
  chars int not null default 0
);

alter table public.word_cache enable row level security;
alter table public.translate_usage enable row level security;
revoke all on public.word_cache, public.translate_usage from anon, authenticated;

-- 오늘(KST) 문자 수를 원자적으로 p_chars 증가. 증가 후 상한(p_limit)을 넘으면 증가시키지 않고 false.
create or replace function public.bump_translate_usage(p_chars int, p_limit int)
returns boolean
language sql
security definer
set search_path = ''
as $$
  with bumped as (
    insert into public.translate_usage as u (day, chars)
    select (now() at time zone 'Asia/Seoul')::date, p_chars
    where p_chars <= p_limit
    on conflict (day) do update set chars = u.chars + excluded.chars
    where u.chars + excluded.chars <= p_limit
    returning 1
  )
  select exists (select 1 from bumped);
$$;

revoke all on function public.bump_translate_usage(int, int) from public, anon, authenticated;
grant execute on function public.bump_translate_usage(int, int) to service_role;
