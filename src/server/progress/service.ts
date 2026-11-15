// 프레임워크 무관 모듈(Next/React import 금지) — NestJS 이전 대상.
import { z } from "zod";
import { findProgress, upsertProgress, type State } from "./repo";

// ponytail: 1차는 1인 사용이라 owner 고정. 2차(로그인)에 인증된 user_id로 교체되는 지점.
const OWNER = "me";

export const passageIdSchema = z.string().regex(/^\S{1,100}$/);

// state는 클라이언트 SessionState의 불투명 스냅샷. 내부 구조는 검증하지 않는다.
export const saveBodySchema = z.object({ state: z.record(z.string(), z.unknown()) });

export class InvalidInput extends Error {}

export function getProgress(passageId: string): Promise<State | null> {
  return findProgress(OWNER, passageId);
}

export async function saveProgress(passageId: string, state: State): Promise<{ updatedAt: string }> {
  if ("passageId" in state && state.passageId !== passageId) {
    throw new InvalidInput("state.passageId does not match URL passageId");
  }
  return { updatedAt: await upsertProgress(OWNER, passageId, state) };
}
