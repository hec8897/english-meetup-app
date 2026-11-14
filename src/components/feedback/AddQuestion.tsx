"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "./ToastProvider";

interface Props {
  /** 질문을 더 만들어 와서 추가하는 함수. 실패하면 throw */
  onAdd: () => Promise<number>;
  label?: string;
}

/** 모든 질문 화면 공통 "질문 더 만들기" */
export function AddQuestion({ onAdd, label = "질문 더 만들기" }: Props) {
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function run() {
    setBusy(true);
    try {
      const n = await onAdd();
      toast.show(`질문 ${n}개를 추가했어요`, { kind: "ok" });
    } catch (e) {
      toast.show(e instanceof Error ? e.message : "질문을 만들지 못했어요", {
        kind: "err",
        action: { label: "다시 시도", onClick: run },
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button variant="secondary" block loading={busy} onClick={run}>
      {busy ? "만드는 중…" : `＋ ${label}`}
    </Button>
  );
}
