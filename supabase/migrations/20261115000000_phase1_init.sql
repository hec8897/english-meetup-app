-- 1차: 서버(service role)만 접근. RLS 켜고 정책 없음, anon/authenticated 권한 회수.

-- 진행 상태. 2차: owner(text) -> user_id uuid 로 교체.
create table public.progress (
  owner text not null default 'me',
  passage_id text not null,
  state jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (owner, passage_id)
);

-- 지문 콘텐츠(시드 + AI 생성). 2차: 사용자별 생성 지문이면 owner 컬럼 추가 검토.
create table public.passages (
  id text primary key,
  data jsonb not null,
  source text not null check (source in ('seed','ai')),
  created_at timestamptz not null default now()
);

-- AI 호출 일일 사용량 카운터. 2차: 사용자별 한도면 (day, user_id) 키로 변경.
create table public.ai_usage (
  day date primary key,
  count int not null default 0
);

-- 영작 확인 결과 캐시. 2차에도 공용 캐시로 유지 가능.
create table public.check_cache (
  key text primary key,
  result jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.progress enable row level security;
alter table public.passages enable row level security;
alter table public.ai_usage enable row level security;
alter table public.check_cache enable row level security;

revoke all on public.progress, public.passages, public.ai_usage, public.check_cache from anon, authenticated;
