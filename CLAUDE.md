# CLAUDE.md

영어 모임 앱 프론트엔드. 지문을 읽고 → 대화 → 표현 학습 → 영작 → 확장 글쓰기 → 마무리하는 모바일 우선 학습 앱. 진도는 Next Route Handler + 로컬 Supabase(Postgres)에 저장한다(1인 사용, 로그인 없음). 영작 확인·질문 생성은 아직 목업. 계획: `docs/backend-plan.html`.

**이 프로젝트의 프론트엔드는 FSD(Feature-Sliced Design) 패턴을 사용한다.** 새 코드는 아래 "구조 (FSD-lite)" 규칙에 맞춰 둔다.

## 스택

Next.js 16 (App Router) · React 19 · TypeScript 5.9 · CSS Modules · Pretendard. Node 22 (`.nvmrc`). 경로 별칭 `@/` = `src/`.

## 명령

```bash
npm run dev        # http://localhost:3000
npm run build
npm run typecheck  # tsc --noEmit
supabase start     # 로컬 DB(Docker). 포트 API 54321 · DB 54322 · Studio 54323
supabase db reset  # supabase/migrations 재적용
```

`.env.local`(git 제외, 예시는 `.env.example`)에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. **서버 전용이라 `NEXT_PUBLIC_` 금지.** Vercel에는 4차(웹 배포 + 로그인) 전까지 이 env를 넣지 않는다 — API가 무인증이라 넣는 순간 누구나 진도를 읽고 쓴다. env가 없으면 진도 API는 500, 클라이언트는 sessionStorage로 폴백한다.

테스트·린트 설정은 없다.

## 구조 (FSD-lite)

import 방향은 `app → features → entities → shared` 한 방향만. 역방향 금지, **피처끼리 import 금지**(공유가 필요하면 entities/shared로 내린다). `entities/session → entities/passage`만 예외로 허용.

- `src/app` — Next 라우트만. `/` 홈, `/p/[id]/{read,talk,study,practice,write,wrap}` 6단계(Screen의 `step` 0~5). page.tsx는 `<PassageGate render={XxxStep} />` 조립만.
- `src/features/{home,read,talk,study,practice,write,wrap}` — 화면 본문(`ui/XxxStep.tsx` + 전용 CSS module). 공개 API는 `index.ts`.
- `src/entities/passage` — `types.ts`(Passage 스키마), `passages.ts`(지문 콘텐츠. `available: false`면 "준비 중"), `Reading`·`Compose`.
- `src/entities/session` — `session.tsx`(진행 상태 reducer + context, `sessionStorage` 키 `english-meetup:session:v1`, 스키마 바꾸면 버전 올림), `usePassage`(URL 지문 id ↔ 세션 동기화), `PassageGate`(usePassage + notFound + Loading 공통 처리 후 `StepProps` 전달). Passage 타입에 의존하므로 shared가 아닌 entities.
- `src/shared/ui` — Button·Card·Tag(Pill·NumberBadge·NumberedRow·TagRow·Chip)·TextArea·BlankInput·Stepper·PageHeader·LinkButton·Loading.
- `src/shared/feedback` — 토스트·모달·바텀시트·확인 다이얼로그·AddQuestion(질문 더 만들기)·CheckResultCard.
- `src/shared/layout` — Screen·TopBar·ReadingControls(`Lang`·`FontScale` 타입 정의).
- `src/server/` — **FSD 레이어 밖.** 프레임워크 무관 순수 TS 서버 로직(`db.ts`, `progress/{service,repo}.ts`). `src/app/api`에서만 import하고 features·entities·shared에서는 import 금지. 나중에 NestJS로 옮길 대상. 소유자는 `OWNER='me'` 고정(2차 회원 도입 시 user_id로 교체).
- `src/app/api/progress/[passageId]` — 얇은 Route Handler. GET `{state|null}` · PUT `{state}`. 클라이언트는 `shared/api/progress.ts`, 동기화 로직은 `entities/session`(서버 GET 성공한 지문만 PUT, 디바운스 800ms).
- `supabase/` — 마이그레이션·config. 테이블 `progress`·`passages`·`ai_usage`·`check_cache`, 전부 RLS ON + 정책 없음(service role로만 접근).
- `src/shared/api/services.ts` — **백엔드 연결 지점.** `CheckService`(영작 확인), `QuestionService`(질문 더 만들기)가 목업. 인터페이스는 유지하고 `services` 객체 구현만 교체. 도메인 무관이라 shared.
- `src/shared/lib/markup.tsx` — 콘텐츠 표기 파서. `src/shared/styles/tokens.css` — 디자인 토큰(A안 블루). 색·간격은 여기 변수만 쓴다.

## 규칙·주의

- 콘텐츠 표기: 지문의 `[[단어]]`는 누르면 뜻 토스트(뜻은 `vocab`), 예문의 `**굵게**`는 표현 강조.
- 새 지문은 `passages.ts`에 `Passage`를 추가하고 `passages` 배열에 넣는다.
- 새 단계는 `features/<step>/ui`에 `StepProps`를 받는 컴포넌트를 만들고, page.tsx에서 `PassageGate`로 감싼다. 본문은 `Screen` + `PageHeader` + 푸터 `LinkButton`.
- 사용자에게 보이는 문구는 한국어, 지문·예문은 영어.
- 현재 콘텐츠: `dad-video-call`(사용 가능), `library-tools`(준비 중).
