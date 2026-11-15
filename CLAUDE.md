# CLAUDE.md

영어 모임 앱 프론트엔드. 지문을 읽고 → 대화 → 표현 학습 → 영작 → 확장 글쓰기 → 마무리하는 모바일 우선 학습 앱. 백엔드는 아직 없고 목업으로 동작한다.

## 스택

Next.js 16 (App Router) · React 19 · TypeScript 5.9 · CSS Modules · Pretendard. Node 22 (`.nvmrc`). 경로 별칭 `@/` = `src/`.

## 명령

```bash
npm run dev        # http://localhost:3000
npm run build
npm run typecheck  # tsc --noEmit
```

테스트·린트 설정은 없다.

## 구조

- `src/app` — 화면. `/` 홈(지문 목록), `/p/[id]/{read,talk,study,practice,write,wrap}` 6단계 (Screen의 `step` 0~5가 이 순서).
- `src/components` — `ui`(Button·Card·Tag·TextArea·BlankInput·Stepper), `layout`(Screen·TopBar·ReadingControls), `feedback`(토스트·모달·바텀시트·확인 다이얼로그·AddQuestion·CheckResultCard), `passage`(Reading·Compose·Loading).
- `src/data` — `types.ts`(Passage 스키마), `passages.ts`(지문 콘텐츠 하드코딩). `available: false`면 홈에서 "준비 중".
- `src/lib/session.tsx` — 진행 상태(답안·결과·언어·글자 크기)를 reducer + context로 관리하고 `sessionStorage`(`english-meetup:session:v1`)에 저장. 스키마를 바꾸면 키 버전을 올린다.
- `src/lib/usePassage.ts` — URL의 지문 id와 세션을 동기화. 모든 단계 페이지가 쓴다. `synced`가 false면 `<Loading />`.
- `src/lib/services.ts` — **백엔드 연결 지점.** `CheckService`(영작 확인), `QuestionService`(질문 더 만들기)가 목업. 인터페이스는 유지하고 `services` 객체의 구현만 교체.
- `src/lib/markup.tsx` — 콘텐츠 표기 파서.
- `src/styles/tokens.css` — 디자인 토큰(A안 블루). 색·간격은 여기 변수만 쓴다.

## 규칙·주의

- 콘텐츠 표기: 지문의 `[[단어]]`는 누르면 뜻 토스트(뜻은 `vocab`), 예문의 `**굵게**`는 표현 강조.
- 새 지문은 `passages.ts`에 `Passage`를 추가하고 `passages` 배열에 넣는다.
- 단계 페이지는 `"use client"` + `usePassage` + `notFound()` + `Screen` 패턴을 따른다.
- 사용자에게 보이는 문구는 한국어, 지문·예문은 영어.
- 현재 콘텐츠: `dad-video-call`(사용 가능), `library-tools`(준비 중).
