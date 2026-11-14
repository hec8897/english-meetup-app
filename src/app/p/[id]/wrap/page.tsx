"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { usePassage } from "@/lib/usePassage";
import { useSession } from "@/lib/session";
import { Screen } from "@/components/layout/Screen";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { Loading } from "@/components/passage/Loading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function WrapPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { passage, synced, state } = usePassage(id);
  const { start } = useSession();
  const [confirm, setConfirm] = useState(false);
  if (!passage) notFound();
  if (!synced) return <Loading />;

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
          <Link href="/" style={{ display: "flex", flex: 1 }}>
            <Button block>홈으로</Button>
          </Link>
        </>
      }
    >
      <div className="stack" style={{ gap: 8 }}>
        <h1 className="page-title">오늘도 수고했어요 🎉</h1>
        <p className="sub">{passage.title}</p>
      </div>
      <Card className="stack">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>오늘 쓴 문장</h2>
        {rows.map((r) => (
          <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 16 }}>
            <span>{r.label}</span>
            <strong style={{ color: "var(--blue)" }}>{r.done} / {r.total}</strong>
          </div>
        ))}
      </Card>
      <Card className="stack">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>오늘의 표현</h2>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
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
