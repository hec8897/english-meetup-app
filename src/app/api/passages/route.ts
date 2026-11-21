import { AiLimitExceeded } from "@/server/ai/usage";
import { generatePassage, passageInputSchema } from "@/server/generate/passage";
import { listPassages } from "@/server/passages/repo";

export const dynamic = "force-dynamic";
// 2단계 LLM 호출(각 60초 + 1회 재시도)이라 길다.
export const maxDuration = 300;

const fail = (err: unknown) => {
  console.error("[api/passages]", err);
  return Response.json({ error: "Internal server error" }, { status: 500 });
};

export async function GET() {
  try {
    return Response.json({ passages: await listPassages() });
  } catch (err) {
    return fail(err);
  }
}

export async function POST(req: Request) {
  const body = passageInputSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Invalid input" }, { status: 400 });
  try {
    return Response.json({ passage: await generatePassage(body.data) });
  } catch (err) {
    if (err instanceof AiLimitExceeded) return Response.json({ error: "Daily AI limit reached" }, { status: 429 });
    return fail(err);
  }
}
