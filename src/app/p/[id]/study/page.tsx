"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { usePassage } from "@/lib/usePassage";
import { useSession } from "@/lib/session";
import { renderBold } from "@/lib/markup";
import { Screen } from "@/components/layout/Screen";
import { Loading } from "@/components/passage/Loading";
import { BlankInput } from "@/components/ui/BlankInput";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { NumberBadge } from "@/components/ui/Tag";
import styles from "./study.module.css";

export default function StudyPage() {
  const { id } = useParams<{ id: string }>();
  const { passage, synced, state } = usePassage(id);
  const { setAnswer } = useSession();
  if (!passage) notFound();
  if (!synced) return <Loading />;

  return (
    <Screen
      step={2}
      backHref={`/p/${id}/talk`}
      footer={
        <Link href={`/p/${id}/practice`} style={{ display: "flex", flex: 1 }}>
          <Button block>연습하러 가기</Button>
        </Link>
      }
    >
      <div className="stack" style={{ gap: 8 }}>
        <h1 className="page-title">오늘의 표현 {passage.expressions.length}가지</h1>
        <p className="sub">지문에서 뽑은 표현이에요. 예문으로 익혀 보세요</p>
      </div>
      {passage.expressions.map((ex, i) => (
        <Card key={ex.id} className={styles.card}>
          <div className={styles.head}>
            <NumberBadge n={i + 1} />
            <div>
              <h2 className={styles.phrase}>{ex.phrase}</h2>
              <p className="sub">{ex.meaningKo}</p>
            </div>
          </div>
          <div className={styles.source}>
            <p>{renderBold(ex.sourceEn, styles.mark)}</p>
            <p className="sub">{ex.sourceKo}</p>
          </div>
          <ul className={styles.examples}>
            {ex.examples.map((e, j) => {
              const key = `${ex.id}-${j}`;
              return (
                <li key={key}>
                  <p className="sub">{e.ko}</p>
                  {e.blank ? (
                    <BlankInput
                      before={e.blank.before}
                      after={e.blank.after}
                      value={state.studyAnswers[key] ?? ""}
                      onChange={(v) => setAnswer("study", key, v)}
                      label={`${ex.phrase} 빈칸`}
                    />
                  ) : (
                    <p className={styles.en}>{renderBold(e.en ?? "", styles.mark)}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      ))}
    </Screen>
  );
}
