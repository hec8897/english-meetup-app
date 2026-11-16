import { lookupWord, TranslateLimitExceeded, wordInputSchema } from "@/server/translate/service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = wordInputSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Invalid input" }, { status: 400 });
  try {
    return Response.json(await lookupWord(body.data));
  } catch (err) {
    if (err instanceof TranslateLimitExceeded) return Response.json({ error: "Daily translate limit reached" }, { status: 429 });
    console.error("[api/translate]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
