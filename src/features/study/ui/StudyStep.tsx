"use client";

import { useSession, type StepProps } from "@/entities/session";
import { renderBold } from "@/shared/lib/markup";
import { Screen } from "@/shared/layout/Screen";
import { BlankInput } from "@/shared/ui/BlankInput";
import { Card } from "@/shared/ui/Card";
import { LinkButton } from "@/shared/ui/LinkButton";
import { PageHeader } from "@/shared/ui/PageHeader";
import { NumberedRow } from "@/shared/ui/Tag";
import styles from "./study.module.css";

export function StudyStep({ id, passage, state }: StepProps) {
  const { setAnswer } = useSession();

  return (
    <Screen
      step={2}
      backHref={`/p/${id}/talk`}
      footer={<LinkButton href={`/p/${id}/practice`}>연습하러 가기</LinkButton>}
    >
      <PageHeader
        title={`오늘의 표현 ${passage.expressions.length}가지`}
        sub="지문에서 뽑은 표현이에요. 예문으로 익혀 보세요"
      />
      {passage.expressions.map((ex, i) => (
        <Card key={ex.id} className={styles.card}>
          <NumberedRow n={i + 1}>
            <div>
              <h2 className={styles.phrase}>{ex.phrase}</h2>
              <p className="sub">{ex.meaningKo}</p>
            </div>
          </NumberedRow>
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
