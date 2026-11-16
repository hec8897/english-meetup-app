import { z } from "zod";
import { PASS_COOKIE, PASS_MAX_AGE, checkPasscode, hashPasscode, passcode } from "@/server/auth/passcode";

export const dynamic = "force-dynamic";

const inputSchema = z.object({ passcode: z.string().min(1).max(200) });

// ponytail: 시도 횟수 제한 없음 — 긴 무작위 passcode 전제. 짧은 코드를 쓰게 되면 IP별 rate limit 추가.
export async function POST(req: Request) {
  const expected = passcode();
  if (!expected) return Response.json({ ok: true });

  const body = inputSchema.safeParse(await req.json().catch(() => null));
  if (!body.success || !checkPasscode(body.data.passcode, expected)) {
    return Response.json({ error: "invalid" }, { status: 401 });
  }

  const res = Response.json({ ok: true });
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.headers.append(
    "Set-Cookie",
    `${PASS_COOKIE}=${hashPasscode(expected)}; Path=/; Max-Age=${PASS_MAX_AGE}; HttpOnly; SameSite=Lax${secure}`,
  );
  return res;
}
