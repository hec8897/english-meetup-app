// 프레임워크 무관 모듈(Next/React import 금지) — NestJS 이전 대상.
import { db } from "../db";

export async function getCachedWord(word: string): Promise<string | undefined> {
  const { data, error } = await db().from("word_cache").select("ko").eq("word", word).maybeSingle();
  if (error) throw error;
  return data?.ko;
}

export async function saveWord(word: string, ko: string): Promise<void> {
  const { error } = await db().from("word_cache").upsert({ word, ko });
  if (error) console.error("[translate] cache save failed", error);
}

/** 오늘(KST) 문자 수를 chars만큼 올린다. 상한을 넘으면 false(증가 없음). */
export async function bumpTranslateUsage(chars: number, limit: number): Promise<boolean> {
  const { data, error } = await db().rpc("bump_translate_usage", { p_chars: chars, p_limit: limit });
  if (error) throw error;
  return data === true;
}
