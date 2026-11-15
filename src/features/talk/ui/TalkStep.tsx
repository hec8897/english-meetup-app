"use client";

import { useSession, type StepProps } from "@/entities/session";
import { AddQuestion } from "@/shared/feedback/AddQuestion";
import { Screen } from "@/shared/layout/Screen";
import { Card } from "@/shared/ui/Card";
import { LinkButton } from "@/shared/ui/LinkButton";
import { PageHeader } from "@/shared/ui/PageHeader";
import { NumberedRow, Pill } from "@/shared/ui/Tag";
import styles from "./talk.module.css";

export function TalkStep({ id, passage, state }: StepProps) {
  const { addTalk } = useSession();

  return (
    <Screen
      step={1}
      backHref={`/p/${id}/read`}
      footer={<LinkButton href={`/p/${id}/study`}>다음</LinkButton>}
    >
      <PageHeader title="함께 이야기해 봐요" sub="돌아가며 두세 문장으로 답해 보세요" />
      {state.talk.map((q, i) => (
        <Card key={q.id}>
          <NumberedRow n={i + 1}>
            <div className={styles.body}>
              <Pill>{q.kind}</Pill>
              <p className={styles.text}>{q.text}</p>
            </div>
          </NumberedRow>
        </Card>
      ))}
      <AddQuestion pool={passage.pool.talk} existing={state.talk} onAdded={addTalk} />
    </Screen>
  );
}
