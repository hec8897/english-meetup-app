import { AiLimitExceeded } from "@/server/ai/usage";
import { checkAnswer, checkInputSchema, type CheckResult as ServerResult } from "@/server/check/service";
import type { CheckResult } from "@/shared/api/services";

export const dynamic = "force-dynamic";

// 서버 스키마와 클라이언트 타입이 어긋나면 컴파일 에러.
const _sameShape: [ServerResult, CheckResult] = [{} as CheckResult, {} as ServerResult];
void _sameShape;

export async function POST(req: Request) {
  const body = checkInputSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Invalid input" }, { status: 400 });
  try {
    return Response.json(await checkAnswer(body.data));
  } catch (err) {
    if (err instanceof AiLimitExceeded) return Response.json({ error: "Daily AI limit reached" }, { status: 429 });
    console.error("[api/check]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
