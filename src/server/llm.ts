// 프레임워크 무관 모듈(Next/React import 금지) — NestJS 이전 대상.
// LLM 공급자 교체 지점. OpenAI Responses API + Structured Outputs(strict json_schema).
import { z } from "zod";

const ENDPOINT = "https://api.openai.com/v1/responses";
const TIMEOUT_MS = 30_000;

type Json = { [k: string]: unknown };

/**
 * zod → OpenAI strict 스키마. strict는 모든 필드 required + additionalProperties:false 를 요구하므로
 * optional 필드는 required로 올리고 null 허용으로 바꾼다(응답의 null은 parse 전에 undefined로 되돌림).
 * ponytail: object/array/anyOf만 순회. record·tuple 등 strict 미지원 타입은 스키마에 쓰지 말 것.
 */
function strictify(s: Json): Json {
  const out: Json = { ...s };
  if (s.type === "object" && s.properties) {
    const props = s.properties as Record<string, Json>;
    const required = new Set((s.required as string[] | undefined) ?? []);
    out.properties = Object.fromEntries(
      Object.entries(props).map(([k, v]) => [k, required.has(k) ? strictify(v) : { anyOf: [strictify(v), { type: "null" }] }]),
    );
    out.required = Object.keys(props);
    out.additionalProperties = false;
  }
  if (s.items) out.items = strictify(s.items as Json);
  if (s.anyOf) out.anyOf = (s.anyOf as Json[]).map(strictify);
  return out;
}

function dropNulls(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(dropNulls);
  if (v && typeof v === "object") {
    return Object.fromEntries(Object.entries(v).filter(([, x]) => x !== null).map(([k, x]) => [k, dropNulls(x)]));
  }
  return v;
}

interface ResponsesBody {
  status?: string;
  incomplete_details?: { reason?: string } | null;
  output?: { type: string; content?: { type: string; text?: string; refusal?: string }[] }[];
}

async function callOnce<T>(body: Json, schema: z.ZodType<T>, key: string): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 500)}`);
  const data = (await res.json()) as ResponsesBody;
  if (data.status !== "completed") throw new Error(`OpenAI status ${data.status} ${data.incomplete_details?.reason ?? ""}`);
  const content = data.output?.find((o) => o.type === "message")?.content ?? [];
  const refusal = content.find((c) => c.type === "refusal");
  if (refusal) throw new Error(`OpenAI refusal: ${refusal.refusal}`);
  const text = content.find((c) => c.type === "output_text")?.text;
  if (!text) throw new Error("OpenAI: no output_text");
  return schema.parse(dropNulls(JSON.parse(text)));
}

/** 구조화 출력 한 번 호출. 실패(네트워크·타임아웃·형식·zod)하면 1회 재시도. 상세는 서버 로그에만. */
export async function llm<T>({
  system,
  user,
  schema,
  maxOutputTokens = 2000,
}: {
  system: string;
  user: string;
  schema: z.ZodType<T>;
  maxOutputTokens?: number;
}): Promise<T> {
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;
  if (!key || !model) throw new Error("OPENAI_API_KEY and OPENAI_MODEL must be set (server env)");

  const { $schema: _, ...jsonSchema } = z.toJSONSchema(schema) as Json;
  const body: Json = {
    model,
    instructions: system,
    input: user,
    max_output_tokens: maxOutputTokens,
    store: false,
    text: { format: { type: "json_schema", name: "result", schema: strictify(jsonSchema), strict: true } },
  };

  try {
    return await callOnce(body, schema, key);
  } catch (err) {
    console.error("[llm] attempt 1 failed, retrying", err);
    try {
      return await callOnce(body, schema, key);
    } catch (err2) {
      console.error("[llm] attempt 2 failed", err2);
      throw new Error("LLM call failed");
    }
  }
}
