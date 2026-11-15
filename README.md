# 영어 모임 앱

지문을 읽고, 이야기하고, 표현을 내 문장으로 써 보는 영어 모임 앱의 프론트엔드. 디자인 A안(블루 / Pretendard), 모바일 우선(최대 430px 프레임).

## 학습 흐름

1. **읽기** — 지문 읽기, 영/한 전환, 글자 크기 조절, `[[단어]]` 누르면 뜻 토스트
2. **대화** — 의견/경험 질문, "질문 더 만들기"
3. **표현 학습** — 지문에서 뽑은 표현과 예문(빈칸 채우기 포함)
4. **영작 연습** — 한국어 문장을 힌트 표현으로 영작, 답안 확인
5. **확장 글쓰기** — 자유 영작
6. **마무리** — 오늘 쓴 문장 수와 표현 요약

## 시작하기

Node 22 필요 (`.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck
```

## 스택

Next.js 16 (App Router) · React 19 · TypeScript · CSS Modules · Pretendard

## 구조

```
src/
├─ app/          화면 (/, /p/[id]/read|talk|study|practice|write|wrap)
├─ components/   ui · layout · feedback · passage
├─ data/         지문 콘텐츠(passages.ts)와 타입
├─ lib/          session(진행 상태) · services(백엔드 연결 지점) · usePassage · markup
└─ styles/       디자인 토큰
```

## 현재 상태

- 백엔드 없음. 영작 확인(`CheckService`)과 질문 더 만들기(`QuestionService`)는 `src/lib/services.ts`의 목업이다. 인터페이스는 그대로 두고 구현만 교체하면 된다.
- 진행 상태는 `sessionStorage`에만 저장된다.
- 지문 2개 중 1개(`dad-video-call`)만 콘텐츠가 있고, `library-tools`는 "준비 중".

## 콘텐츠 표기

- 지문의 `[[단어]]` — 누르면 뜻 토스트
- 예문의 `**굵게**` — 표현 강조
