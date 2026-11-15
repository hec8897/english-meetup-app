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

FSD-lite. import 방향은 `app → features → entities → shared` 한 방향, 피처끼리 import 금지.

```
src/
├─ app/        Next 라우트만 (/, /p/[id]/read|talk|study|practice|write|wrap)
├─ features/   단계별 화면 본문 (home · read · talk · study · practice · write · wrap)
├─ entities/   passage(타입·콘텐츠·Reading·Compose) · session(진행 상태·usePassage·PassageGate)
└─ shared/     ui · feedback · layout · api(services) · lib(markup) · styles(토큰)
```

## 현재 상태

- 백엔드 없음. 영작 확인(`CheckService`)과 질문 더 만들기(`QuestionService`)는 `src/shared/api/services.ts`의 목업이다. 인터페이스는 그대로 두고 구현만 교체하면 된다.
- 진행 상태는 `sessionStorage`에만 저장된다.
- 지문 2개 중 1개(`dad-video-call`)만 콘텐츠가 있고, `library-tools`는 "준비 중".

## 콘텐츠 표기

- 지문의 `[[단어]]` — 누르면 뜻 토스트
- 예문의 `**굵게**` — 표현 강조
