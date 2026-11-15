import { AiLimitExceeded } from "@/server/ai/usage";
import { generateQuestions, PassageNotFound, questionsInputSchema } from "@/server/generate/questions";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = questionsInputSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Invalid input" }, { status: 400 });
  try {
    return Response.json({ items: await generateQuestions(body.data) });
  } catch (err) {
    if (err instanceof PassageNotFound) return Response.json({ error: "Passage not found" }, { status: 404 });
    if (err instanceof AiLimitExceeded) return Response.json({ error: "Daily AI limit reached" }, { status: 429 });
    console.error("[api/questions]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
