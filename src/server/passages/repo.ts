// 프레임워크 무관 모듈(Next/React import 금지) — NestJS 이전 대상.
// server → entities import는 이 디렉터리에만 둔다. 지문 = seed(코드) + passages 테이블(AI 생성) 병합.
import type { Passage } from "@/entities/passage/types";
// index가 아니라 passages를 직접 — index는 Reading·Compose(클라이언트 UI)까지 끌고 온다.
import { passages as seed } from "@/entities/passage/passages";
import { db } from "../db";
import { passageSchema } from "./schema";

export type { Passage };

export type PassageSummary = Pick<Passage, "id" | "title" | "titleKo" | "category" | "level" | "minutes" | "available">;

const summary = ({ id, title, titleKo, category, level, minutes, available }: Passage): PassageSummary => ({
  id, title, titleKo, category, level, minutes, available,
});

/** DB 행 → Passage. 스키마가 안 맞는 행은 건너뛴다(로그만). */
function fromRow(row: { id: string; data: unknown }): Passage | undefined {
  const r = passageSchema.safeParse(row.data);
  if (!r.success) console.error("[passages] invalid row", row.id, r.error.issues.slice(0, 3));
  return r.success ? r.data : undefined;
}

/** 홈 목록: seed 먼저, 그 뒤 생성 지문 최신순. */
export async function listPassages(): Promise<PassageSummary[]> {
  // ponytail: data 전체를 받아 요약만 돌려준다. 지문이 수백 개가 되면 요약 컬럼을 따로 뽑을 것.
  const { data, error } = await db().from("passages").select("id, data").order("created_at", { ascending: false });
  if (error) throw error;
  const fromDb = data.map(fromRow).filter((p): p is Passage => !!p && !seed.some((s) => s.id === p.id));
  return [...seed, ...fromDb].map(summary);
}

/** 학습 가능한 지문 하나. seed는 DB를 거치지 않는다. */
export async function getPassage(id: string): Promise<Passage | undefined> {
  const s = seed.find((p) => p.id === id);
  if (s) return s.available ? s : undefined;
  const { data, error } = await db().from("passages").select("id, data").eq("id", id).maybeSingle();
  if (error) throw error;
  const p = data ? fromRow(data) : undefined;
  return p?.available ? p : undefined;
}

export async function insertPassage(p: Passage): Promise<void> {
  const { error } = await db().from("passages").insert({ id: p.id, data: p, source: "ai" });
  if (error) throw error;
}
