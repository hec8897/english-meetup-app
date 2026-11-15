// 자주 나오는 실수. 걸리면 LLM 없이 바로 fix로 돌려준다.
export const FIXES: { test: RegExp; replace: (s: string) => string; reason: string }[] = [
  {
    test: /\bhalf sleep\b/i,
    replace: (s) => s.replace(/\bhalf sleep\b/gi, "half asleep"),
    reason:
      "asleep은 '잠든 상태'를 나타내는 형용사예요. sleep은 동사나 명사라서 'half sleep'처럼 쓰지 않아요.",
  },
  {
    test: /\blooking forward to (see|meet|talk|hear)\b/i,
    replace: (s) => s.replace(/\blooking forward to (see|meet|talk|hear)\b/gi, "looking forward to $1ing"),
    reason: "looking forward to 뒤의 to는 전치사라서, 동사가 오면 -ing 형태로 써요.",
  },
  {
    test: /\blooking forward\b(?! to)/i,
    replace: (s) => s.replace(/\blooking forward\b(?! to)/gi, "looking forward to"),
    reason: "'기대하다'는 look forward가 아니라 look forward to예요. to를 빼먹지 않도록 해요.",
  },
  {
    test: /\blaugh so hard\b/i,
    replace: (s) => s.replace(/\blaugh so hard\b/gi, "laughed so hard"),
    reason: "이미 일어난 일을 말할 때는 과거형 laughed를 써요.",
  },
];
