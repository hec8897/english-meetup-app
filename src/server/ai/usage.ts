// 프레임워크 무관 모듈(Next/React import 금지) — NestJS 이전 대상.
import { db } from "../db";

export class AiLimitExceeded extends Error {}

/** 전역 일일 AI 호출 상한(AI_DAILY_LIMIT, 기본 200). 넘으면 AiLimitExceeded. */
export async function bumpAiUsage(): Promise<void> {
  const limit = Number(process.env.AI_DAILY_LIMIT || 200);
  const { data, error } = await db().rpc("bump_ai_usage", { p_limit: limit });
  if (error) throw error;
  if (data !== true) throw new AiLimitExceeded("AI daily limit exceeded");
}
