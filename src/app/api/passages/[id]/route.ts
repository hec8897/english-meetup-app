import { getPassage } from "@/server/passages/repo";
import { passageIdSchema } from "@/server/progress/service";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const id = passageIdSchema.safeParse((await params).id);
  if (!id.success) return Response.json({ error: "Invalid id" }, { status: 400 });
  try {
    const passage = await getPassage(id.data);
    if (!passage) return Response.json({ error: "Passage not found" }, { status: 404 });
    return Response.json({ passage });
  } catch (err) {
    console.error("[api/passages/:id]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
