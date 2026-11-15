/**
 * 백엔드 연결 지점. 인터페이스는 그대로 두고 구현만 교체해요.
 * check·questions 모두 서버 구현(app/api).
 */

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
  // ponytail: Hint 구조만 받는다 (shared는 entities를 import하지 않음)
  check(input: { answer: string; hint: { phrase: string; meaningKo: string } }): Promise<CheckResult>;
}

export type QuestionKind = "talk" | "practice" | "write";

export interface QuestionService {
  /** 지문에 맞는 새 질문을 최대 count개 만들어 줘요. existing은 이미 있는 질문 본문(talk.text / practice.ko / write.ko). */
  generate<T extends { id: string }>(input: {
    kind: QuestionKind;
    passageId: string;
    existing: string[];
    count: number;
  }): Promise<T[]>;
}

// 서버: POST /api/check (규칙 → 캐시 → LLM). 실패(네트워크·429·500)는 throw → 호출 화면이 토스트로 안내.
const httpCheckService: CheckService = {
  async check(input) {
    const res = await fetch("/api/check", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(70_000),
    });
    if (!res.ok) throw new Error(`check API ${res.status}`);
    return (await res.json()) as CheckResult;
  },
};

// 서버: POST /api/questions (LLM). 실패는 throw → AddQuestion이 메시지를 토스트로 보여 줘요.
const httpQuestionService: QuestionService = {
  async generate<T extends { id: string }>(input: Parameters<QuestionService["generate"]>[0]) {
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(70_000),
    });
    if (res.status === 429) throw new Error("오늘 만들 수 있는 질문을 다 썼어요. 내일 다시 시도해 주세요");
    if (!res.ok) throw new Error("질문을 만들지 못했어요. 잠시 후 다시 시도해 주세요");
    return ((await res.json()) as { items: T[] }).items;
  },
};

export const services = {
  check: httpCheckService,
  questions: httpQuestionService,
};
