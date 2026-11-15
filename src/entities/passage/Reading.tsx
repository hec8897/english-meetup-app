"use client";

import type { Passage } from "./types";
import type { FontScale, Lang } from "@/shared/layout/ReadingControls";
import { splitVocab } from "@/shared/lib/markup";
import { useToast } from "@/shared/feedback/ToastProvider";
import styles from "./Reading.module.css";

const SIZES = [16, 18, 21];

export function Reading({ passage, lang, scale }: { passage: Passage; lang: Lang; scale: FontScale }) {
  const toast = useToast();
  const paras = lang === "en" ? passage.paragraphsEn : passage.paragraphsKo;
  return (
    <article className={styles.body} style={{ fontSize: SIZES[scale] }} lang={lang}>
      {paras.map((p, i) => (
        <p key={i} className={styles.p}>
          {lang === "en"
            ? splitVocab(p).map((s, j) =>
                s.vocab ? (
                  <button
                    key={j}
                    type="button"
                    className={styles.word}
                    onClick={() => toast.showWord(s.text, passage.vocab[s.text] ?? "")}
                  >
                    {s.text}
                  </button>
                ) : (
                  <span key={j}>{s.text}</span>
                ),
              )
            : p}
        </p>
      ))}
    </article>
  );
}
