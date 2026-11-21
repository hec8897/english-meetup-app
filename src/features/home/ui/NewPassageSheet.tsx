"use client";

import { useState, type FormEvent } from "react";
import type { Category, Level, Passage } from "@/entities/passage";
import { createPassage } from "@/shared/api/passages";
import { BottomSheet } from "@/shared/feedback/BottomSheet";
import { useToast } from "@/shared/feedback/ToastProvider";
import { Button } from "@/shared/ui/Button";
import { Chip } from "@/shared/ui/Tag";
import styles from "./home.module.css";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "Story", label: "이야기" },
  { value: "Social News", label: "사회 뉴스" },
];
const LEVELS: { value: Level; label: string }[] = [
  { value: "Easy", label: "쉬움" },
  { value: "Medium", label: "보통" },
];

function Choice<T extends string>({ label, options, value, onChange }: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className={styles.field}>
      <legend className={styles.label}>{label}</legend>
      <div className={styles.choices}>
        {options.map((o) => (
          <button key={o.value} type="button" className={styles.choice} aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
            <Chip active={o.value === value}>{o.label}</Chip>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function NewPassageSheet({ open, onClose, onCreated }: {
  open: boolean;
  onClose: () => void;
  onCreated: (p: Passage) => void;
}) {
  const toast = useToast();
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<Category>("Story");
  const [level, setLevel] = useState<Level>("Easy");
  const [busy, setBusy] = useState(false);

  async function submit(e?: FormEvent) {
    e?.preventDefault();
    setBusy(true);
    try {
      const p = await createPassage<Passage>({ topic: topic.trim(), category, level });
      onCreated(p);
      setTopic("");
      toast.show("새 지문을 만들었어요", { kind: "ok" });
    } catch (err) {
      toast.show(err instanceof Error && !(err instanceof DOMException) ? err.message : "지문을 만들지 못했어요", {
        kind: "err",
        action: { label: "다시 시도", onClick: () => submit() },
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <BottomSheet open={open} title="새 지문 만들기" onClose={() => !busy && onClose()}>
      <form className={styles.form} onSubmit={submit}>
        <label className={styles.field}>
          <span className={styles.label}>주제</span>
          <input
            className={styles.input}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            maxLength={200}
            placeholder="예: 처음 해 본 캠핑"
            disabled={busy}
          />
        </label>
        <Choice label="카테고리" options={CATEGORIES} value={category} onChange={setCategory} />
        <Choice label="난이도" options={LEVELS} value={level} onChange={setLevel} />
        <Button type="submit" block loading={busy} disabled={!topic.trim()}>
          {busy ? "만드는 중…" : "만들기"}
        </Button>
        {busy ? <p className="sub" role="status">지문과 문제를 만들고 있어요. 1~2분 걸릴 수 있어요.</p> : null}
      </form>
    </BottomSheet>
  );
}
