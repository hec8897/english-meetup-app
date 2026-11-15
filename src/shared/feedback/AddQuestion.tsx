"use client";

import { useState } from "react";
import { services } from "@/shared/api/services";
import { Button } from "@/shared/ui/Button";
import { useToast } from "./ToastProvider";

interface Props<T extends { id: string }> {
  /** 질문 후보 */
  pool: T[];
  /** 이미 화면에 있는 질문 */
  existing: T[];
  /** 새로 만든 질문을 받아 추가 */
  onAdded: (items: T[]) => void;
  label?: string;
}

/** 모든 질문 화면 공통 "질문 더 만들기" */
export function AddQuestion<T extends { id: string }>({ pool, existing, onAdded, label = "질문 더 만들기" }: Props<T>) {
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function run() {
    setBusy(true);
    try {
      const items = await services.questions.generate({
        pool,
        existingIds: existing.map((q) => q.id),
        count: 3,
      });
      onAdded(items);
      toast.show(`질문 ${items.length}개를 추가했어요`, { kind: "ok" });
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
