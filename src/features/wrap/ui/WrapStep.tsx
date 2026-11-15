"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, type StepProps } from "@/entities/session";
import { ConfirmDialog } from "@/shared/feedback/ConfirmDialog";
import { Screen } from "@/shared/layout/Screen";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { LinkButton } from "@/shared/ui/LinkButton";
import { PageHeader } from "@/shared/ui/PageHeader";
import styles from "./wrap.module.css";

export function WrapStep({ id, passage, state }: StepProps) {
  const router = useRouter();
  const { start } = useSession();
  const [confirm, setConfirm] = useState(false);

  const filled = (a: Record<string, string>) => Object.values(a).filter((v) => v.trim()).length;
  const rows = [
    { label: "영작 연습", done: filled(state.practiceAnswers), total: state.practice.length },
    { label: "확장 글쓰기", done: filled(state.writeAnswers), total: state.write.length },
  ];

  return (
    <Screen
      step={5}
      backHref={`/p/${id}/write`}
      footer={
        <>
          <Button variant="secondary" block onClick={() => setConfirm(true)}>처음부터 다시</Button>
          <LinkButton href="/">홈으로</LinkButton>
        </>
      }
    >
      <PageHeader title="오늘도 수고했어요 🎉" sub={passage.title} />
      <Card className="stack">
        <h2 className={styles.title}>오늘 쓴 문장</h2>
        {rows.map((r) => (
          <div key={r.label} className={styles.row}>
            <span>{r.label}</span>
            <strong className={styles.count}>{r.done} / {r.total}</strong>
          </div>
        ))}
      </Card>
      <Card className="stack">
        <h2 className={styles.title}>오늘의 표현</h2>
        <ul className={styles.list}>
          {passage.expressions.map((e) => (
            <li key={e.id}><strong>{e.phrase}</strong> <span className="sub">{e.meaningKo}</span></li>
          ))}
        </ul>
      </Card>
      <ConfirmDialog
        open={confirm}
        title="처음부터 다시 할까요?"
        description="지금까지 쓴 문장이 모두 지워져요."
        confirmLabel="다시 시작"
        danger
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          start(passage);
          router.push(`/p/${id}/read`);
        }}
      />
    </Screen>
  );
}
