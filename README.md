# 영어 모임 앱 (프론트엔드)

지문 읽기 → 대화 → 표현 학습 → 영작 연습 → 확장 글쓰기 → 마무리. 디자인 A안(블루 / Pretendard).

## 실행
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## 구조
- `src/app` — 화면 (`/`, `/p/[id]/read|talk|study|practice|write|wrap`)
- `src/components` — ui / layout / feedback(토스트·단어 토스트·모달) / passage
- `src/data` — 지문 콘텐츠와 타입
- `src/lib/services.ts` — **백엔드 연결 지점.** 영작 확인(CheckService), 질문 더 만들기(QuestionService)가 지금은 목업. 인터페이스는 그대로 두고 구현만 교체
- `src/lib/session.tsx` — 진행 상태 (sessionStorage에 저장)
- `src/styles/tokens.css` — 디자인 토큰

콘텐츠 표기: 지문의 `[[단어]]`는 누르면 뜻 토스트, 예문의 `**굵게**`는 표현 강조.
