"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { usePassage } from "@/lib/usePassage";
import { useSession } from "@/lib/session";
import { services } from "@/lib/services";
import { Screen } from "@/components/layout/Screen";
import { AddQuestion } from "@/components/feedback/AddQuestion";
import { Loading } from "@/components/passage/Loading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { NumberBadge, Pill } from "@/components/ui/Tag";

export default function TalkPage() {
  const { id } = useParams<{ id: string }>();
  const { passage, synced, state } = usePassage(id);
  const { addTalk } = useSession();
  if (!passage) notFound();
  if (!synced) return <Loading />;

  return (
    <Screen
      step={1}
      backHref={`/p/${id}/read`}
      footer={
        <Link href={`/p/${id}/study`} style={{ display: "flex", flex: 1 }}>
          <Button block>다음</Button>
        </Link>
      }
    >
      <div className="stack" style={{ gap: 8 }}>
        <h1 className="page-title">함께 이야기해 봐요</h1>
        <p className="sub">돌아가며 두세 문장으로 답해 보세요</p>
      </div>
      {state.talk.map((q, i) => (
        <Card key={q.id}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <NumberBadge n={i + 1} />
            <div className="stack" style={{ gap: 8, alignItems: "flex-start" }}>
              <Pill>{q.kind}</Pill>
              <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5 }}>{q.text}</p>
            </div>
          </div>
        </Card>
      ))}
      <AddQuestion
        onAdd={async () => {
          const items = await services.questions.generate({
            pool: passage.pool.talk,
            existingIds: state.talk.map((q) => q.id),
            count: 3,
          });
          addTalk(items);
          return items.length;
        }}
      />
    </Screen>
  );
}
