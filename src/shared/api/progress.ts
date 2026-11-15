/**
 * 진행 상태 서버 클라이언트. 계약: GET/PUT /api/progress/{passageId}
 * shared는 entities를 import하지 않으므로 state 타입은 제네릭으로 받는다.
 */

// ponytail: 같은 오리진. 외부 백엔드로 옮기면 환경변수로 교체.
const BASE = "";
const TIMEOUT_MS = 3000;

const url = (passageId: string) => `${BASE}/api/progress/${encodeURIComponent(passageId)}`;

async function ok(res: Response): Promise<Response> {
  if (!res.ok) throw new Error(`progress API ${res.status}`);
  return res;
}

export async function fetchProgress<T>(passageId: string, signal?: AbortSignal): Promise<T | null> {
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  const res = await fetch(url(passageId), {
    cache: "no-store",
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  }).then(ok);
  return ((await res.json()) as { state: T | null }).state;
}

export async function saveProgress<T>(
  passageId: string,
  state: T,
  opts: { keepalive?: boolean } = {},
): Promise<{ ok: true; updatedAt: string }> {
  const res = await fetch(url(passageId), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state }),
    keepalive: opts.keepalive,
  }).then(ok);
  return res.json();
}
