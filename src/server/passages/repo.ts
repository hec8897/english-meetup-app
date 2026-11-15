// 프레임워크 무관 모듈(Next/React import 금지) — NestJS 이전 대상.
// server → entities import는 이 파일 한 곳에만 둔다.
// ponytail: P2c 에서 DB 지문도 조회하도록 확장
import type { Passage } from "@/entities/passage";
// index가 아니라 passages를 직접 — index는 Reading·Compose(클라이언트 UI)까지 끌고 온다.
import { passages } from "@/entities/passage/passages";

export type { Passage };

export async function getPassage(id: string): Promise<Passage | undefined> {
  return passages.find((p) => p.id === id && p.available);
}
