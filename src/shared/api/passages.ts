/**
 * 지문 서버 클라이언트. 계약: GET /api/passages · GET /api/passages/{id} · POST /api/passages
 * shared는 entities를 import하지 않으므로 지문 타입은 제네릭으로 받는다.
 */

async function ok(res: Response): Promise<Response> {
  if (!res.ok) throw new Error(`passages API ${res.status}`);
  return res;
}

export async function fetchPassageList<T>(): Promise<T[]> {
  const res = await fetch("/api/passages", { cache: "no-store", signal: AbortSignal.timeout(5000) }).then(ok);
  return ((await res.json()) as { passages: T[] }).passages;
}

/** 없으면(404) null, 서버 실패는 throw. */
export async function fetchPassage<T>(id: string, signal?: AbortSignal): Promise<T | null> {
  const timeout = AbortSignal.timeout(5000);
  const res = await fetch(`/api/passages/${encodeURIComponent(id)}`, {
    cache: "no-store",
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });
  if (res.status === 404) return null;
  await ok(res);
  return ((await res.json()) as { passage: T }).passage;
}

export async function createPassage<T>(input: { topic: string; category: string; level: string }): Promise<T> {
  const res = await fetch("/api/passages", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(280_000),
  });
  if (res.status === 429) throw new Error("오늘 만들 수 있는 횟수를 다 썼어요. 내일 다시 시도해 주세요");
  if (!res.ok) throw new Error("지문을 만들지 못했어요. 잠시 후 다시 시도해 주세요");
  return ((await res.json()) as { passage: T }).passage;
}
