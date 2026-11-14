/**
 * 백엔드 연결 전 목업 서비스.
 * 백엔드가 정해지면 이 인터페이스를 그대로 두고 구현만 교체하면 돼요.
 */
import type { Hint } from "@/data/types";

export type CheckStatus = "good" | "fix" | "missing-hint";

export interface CheckResult {
  status: CheckStatus;
  hintUsed: boolean;
  hintUsageOk: boolean;
  grammarOk: boolean;
  naturalOk: boolean;
  corrected?: string;
  reasonKo: string;
}

export interface CheckService {
  check(input: { answer: string; hint: Hint }): Promise<CheckResult>;
}

export interface QuestionService {
  /** pool에서 아직 쓰지 않은 질문을 count개까지 만들어 줘요. */
  generate<T extends { id: string }>(input: {
    pool: T[];
    existingIds: string[];
    count: number;
  }): Promise<T[]>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 자주 나오는 실수를 규칙으로 잡는 아주 단순한 목업 */
const FIXES: { test: RegExp; replace: (s: string) => string; reason: string }[] = [
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

export const mockCheckService: CheckService = {
  async check({ answer, hint }) {
    await wait(450);
    const text = answer.trim();
    const hintUsed = text.toLowerCase().includes(hint.phrase.toLowerCase());

    const fix = FIXES.find((f) => f.test.test(text));
    if (fix) {
      return {
        status: "fix",
        hintUsed,
        hintUsageOk: false,
        grammarOk: true,
        naturalOk: true,
        corrected: fix.replace(text),
        reasonKo: fix.reason,
      };
    }
    if (!hintUsed) {
      return {
        status: "missing-hint",
        hintUsed: false,
        hintUsageOk: false,
        grammarOk: true,
        naturalOk: true,
        reasonKo: `힌트 표현 '${hint.phrase}'을 넣어서 다시 써 보세요.`,
      };
    }
    return {
      status: "good",
      hintUsed: true,
      hintUsageOk: true,
      grammarOk: true,
      naturalOk: true,
      reasonKo: "표현을 알맞게 썼고 자연스러운 문장이에요.",
    };
  },
};

export const mockQuestionService: QuestionService = {
  async generate({ pool, existingIds, count }) {
    await wait(600);
    const taken = new Set(existingIds);
    const fresh = pool.filter((q) => !taken.has(q.id)).slice(0, count);
    if (fresh.length === 0) {
      throw new Error("더 만들 수 있는 질문이 없어요");
    }
    return fresh;
  },
};

export const services = {
  check: mockCheckService,
  questions: mockQuestionService,
};
