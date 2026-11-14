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

export default function PracticePage() {
  const { id } = useParams<{ id: string }>();
  const { passage, synced, state } = usePassage(id);
  const { setAnswer, setResult, addPractice } = useSession();
  if (!passage) notFound();
  if (!synced) return <Loading />;

  return (
    <Screen
      step={3}
      backHref={`/p/${id}/study`}
      footer={
        <Link href={`/p/${id}/write`} style={{ display: "flex", flex: 1 }}>
          <Button block>다음</Button>
        </Link>
      }
    >
      <div className="stack" style={{ gap: 8 }}>
        <h1 className="page-title">영어로 한 문장 써 봐요</h1>
        <p className="sub">힌트 표현을 넣어서 영어 한 문장을 만들어 보세요</p>
      </div>
      <Compose
        items={state.practice}
        answers={state.practiceAnswers}
        results={state.practiceResults}
        onAnswer={(k, v) => setAnswer("practice", k, v)}
        onResult={(k, r) => setResult("practice", k, r)}
        placeholder="영어로 써 보세요"
      />
      <AddQuestion
        onAdd={async () => {
          const items = await services.questions.generate({
            pool: passage.pool.practice,
            existingIds: state.practice.map((q) => q.id),
            count: 3,
          });
          addPractice(items);
          return items.length;
        }}
      />
    </Screen>
  );
}
