import { db } from "../db";

export type State = Record<string, unknown>;

export async function findProgress(owner: string, passageId: string): Promise<State | null> {
  const { data, error } = await db()
    .from("progress")
    .select("state")
    .eq("owner", owner)
    .eq("passage_id", passageId)
    .maybeSingle();
  if (error) throw error;
  return (data?.state as State | undefined) ?? null;
}

export async function upsertProgress(owner: string, passageId: string, state: State): Promise<string> {
  const { data, error } = await db()
    .from("progress")
    .upsert(
      { owner, passage_id: passageId, state, updated_at: new Date().toISOString() },
      { onConflict: "owner,passage_id" },
    )
    .select("updated_at")
    .single();
  if (error) throw error;
  return data.updated_at as string;
}
