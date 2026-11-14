"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { usePassage } from "@/lib/usePassage";
import { useSession } from "@/lib/session";
import { services } from "@/lib/services";
import { Screen } from "@/components/layout/Screen";
import { AddQuestion } from "@/components/feedback/AddQuestion";
import { Compose } from "@/components/passage/Compose";
import { Loading } from "@/components/passage/Loading";
import { Button } from "@/components/ui/Button";

export default function WritePage() {
  const { id } = useParams<{ id: string }>();
  const { passage, synced, state } = usePassage(id);
  const { setAnswer, setResult, addWrite } = useSession();
  if (!passage) notFound();
  if (!synced) return <Loading />;

  return (
    <Screen
      step={4}
      backHref={`/p/${id}/practice`}
      footer={
        <Link href={`/p/${id}/wrap`} style={{ display: "flex", flex: 1 }}>
          <Button block>마무리하기</Button>
        </Link>
      }
    >
      <div className="stack" style={{ gap: 8 }}>
        <h1 className="page-title">내 이야기로 넓혀 봐요</h1>
        <p className="sub">표현을 넣어 두세 문장으로 이어 써 보세요</p>
      </div>
      <Compose
        rows={4}
        items={state.write}
        answers={state.writeAnswers}
        results={state.writeResults}
        onAnswer={(k, v) => setAnswer("write", k, v)}
        onResult={(k, r) => setResult("write", k, r)}
        placeholder="두세 문장으로 써 보세요"
      />
      <AddQuestion
        onAdd={async () => {
          const items = await services.questions.generate({
            pool: passage.pool.write,
            existingIds: state.write.map((q) => q.id),
            count: 3,
          });
          addWrite(items);
          return items.length;
        }}
      />
    </Screen>
  );
}
