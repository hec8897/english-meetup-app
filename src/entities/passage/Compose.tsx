"use client";

import { useState } from "react";
import type { Hint } from "./types";
import { services, type CheckResult } from "@/shared/api/services";
import { useToast } from "@/shared/feedback/ToastProvider";
import { CheckResultCard } from "@/shared/feedback/CheckResultCard";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Chip, NumberedRow } from "@/shared/ui/Tag";
import { TextArea } from "@/shared/ui/TextArea";
import styles from "./Compose.module.css";

export interface ComposeItem {
  id: string;
  ko: string;
  hint: Hint;
  model?: string;
}

interface Props {
  items: ComposeItem[];
  answers: Record<string, string>;
  results: Record<string, CheckResult>;
  onAnswer: (id: string, value: string) => void;
  onResult: (id: string, r: CheckResult | null) => void;
  /** 한 문장 영작이면 true, 확장 글쓰기면 false */
  rows?: number;
  placeholder: string;
}

export function Compose({ items, answers, results, onAnswer, onResult, rows = 2, placeholder }: Props) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const toast = useToast();

  async function check(item: ComposeItem) {
    const answer = (answers[item.id] ?? "").trim();
    if (!answer) {
      toast.show("먼저 문장을 써 주세요", { kind: "info" });
      return;
    }
    setBusyId(item.id);
    try {
      onResult(item.id, await services.check.check({ answer, hint: item.hint }));
    } catch {
      toast.show("확인하지 못했어요. 잠시 후 다시 시도해 주세요", { kind: "err" });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      {items.map((item, i) => {
        const value = answers[item.id] ?? "";
        const result = results[item.id];
        return (
          <Card key={item.id} className={styles.card}>
            <NumberedRow n={i + 1}>
              <p className={styles.ko}>{item.ko}</p>
            </NumberedRow>
            <div className={styles.hint}>
              <Chip active>{item.hint.phrase}</Chip>
              <span className="sub">{item.hint.meaningKo}</span>
            </div>
            <TextArea
              rows={rows}
              value={value}
              placeholder={placeholder}
              aria-label={`${i + 1}번 영어 문장`}
              onChange={(e) => {
                onAnswer(item.id, e.target.value);
                if (result) onResult(item.id, null);
              }}
            />
            {result ? <CheckResultCard result={result} original={value} /> : null}
            {result?.status === "good" && item.model ? (
              <p className={styles.model}>예시 답안 · {item.model}</p>
            ) : null}
            <Button variant="secondary" loading={busyId === item.id} onClick={() => check(item)}>
              {busyId === item.id ? "확인 중…" : result ? "다시 확인" : "확인하기"}
            </Button>
          </Card>
        );
      })}
    </>
  );
}
