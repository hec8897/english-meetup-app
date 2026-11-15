import { InvalidInput, getProgress, passageIdSchema, saveBodySchema, saveProgress } from "@/server/progress/service";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 200 * 1024;

type Ctx = { params: Promise<{ passageId: string }> };

const bad = (error: string) => Response.json({ error }, { status: 400 });
const fail = (err: unknown) => {
  console.error("[api/progress]", err);
  return Response.json({ error: "Internal server error" }, { status: 500 });
};

export async function GET(_req: Request, { params }: Ctx) {
  const id = passageIdSchema.safeParse((await params).passageId);
  if (!id.success) return bad("Invalid passageId");
  try {
    return Response.json({ state: await getProgress(id.data) });
  } catch (err) {
    return fail(err);
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  const id = passageIdSchema.safeParse((await params).passageId);
  if (!id.success) return bad("Invalid passageId");

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return Response.json({ error: "Body too large" }, { status: 413 });
  const text = await req.text();
  if (Buffer.byteLength(text) > MAX_BODY_BYTES) return Response.json({ error: "Body too large" }, { status: 413 });

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return bad("Invalid JSON");
  }
  const body = saveBodySchema.safeParse(json);
  if (!body.success) return bad("Body must be { state: object }");

  try {
    const { updatedAt } = await saveProgress(id.data, body.data.state);
    return Response.json({ ok: true, updatedAt });
  } catch (err) {
    if (err instanceof InvalidInput) return bad(err.message);
    return fail(err);
  }
}
