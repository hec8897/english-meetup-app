// 프레임워크 무관 모듈(Next/React import 금지) — NestJS 이전 대상.
// 단어 뜻: 정규화 → word_cache → (일일 문자 상한) → GCP Translation v2 Basic → 캐시 저장.
// ponytail: 단어 단독 번역이라 다의어·활용형은 부정확할 수 있다. 문제가 크면 이 파일 안만 LLM(문장 문맥)으로 교체.
import { z } from "zod";
import { bumpTranslateUsage, getCachedWord, saveWord } from "./repo";

export class TranslateLimitExceeded extends Error {}

/** 앞뒤 공백·구두점·따옴표 제거 + 소문자. 굽은 아포스트로피는 '로. */
export const normalizeWord = (raw: string) =>
  raw.trim().toLowerCase().replace(/[‘’]/g, "'").replace(/^[\p{P}\p{S}\s]+|[\p{P}\p{S}\s]+$/gu, "");

export const wordInputSchema = z.object({
  word: z
    .string()
    .max(100)
    .transform(normalizeWord)
    .pipe(z.string().regex(/^(?=.*[a-z])[a-z'-]{1,40}$/)),
});
export type WordInput = z.infer<typeof wordInputSchema>;

const ENDPOINT = "https://translation.googleapis.com/language/translate/v2";

async function googleTranslate(word: string): Promise<string> {
  const key = process.env.GCP_TRANSLATE_API_KEY;
  if (!key) throw new Error("GCP_TRANSLATE_API_KEY must be set (server env, no NEXT_PUBLIC_ prefix)");
  // 키는 URL 쿼리 대신 헤더로 — 에러·로그에 URL이 찍혀도 키가 노출되지 않는다.
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({ q: word, source: "en", target: "ko", format: "text" }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) throw new Error(`GCP Translation ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as { data?: { translations?: { translatedText?: string }[] } };
  const ko = json.data?.translations?.[0]?.translatedText?.trim();
  if (!ko) throw new Error("GCP Translation: empty translatedText");
  return ko;
}

/** input.word는 wordInputSchema로 정규화된 값. */
export async function lookupWord({ word }: WordInput): Promise<{ ko: string }> {
  const cached = await getCachedWord(word);
  if (cached !== undefined) return { ko: cached };

  const limit = Number(process.env.GCP_DAILY_CHAR_LIMIT || 20000);
  if (!(await bumpTranslateUsage(word.length, limit))) throw new TranslateLimitExceeded("Translate daily char limit exceeded");

  // 번역 불가(고유명사 등)로 입력이 그대로 와도 저장 — 같은 단어 재호출 방지.
  const ko = await googleTranslate(word);
  await saveWord(word, ko);
  return { ko };
}
