"use client";

import styles from "./ReadingControls.module.css";

export type Lang = "en" | "ko";
export type FontScale = 0 | 1 | 2;

export function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div role="group" aria-label="언어 전환" className={styles.seg}>
      {(["en", "ko"] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={lang === l}
          className={lang === l ? styles.on : ""}
          onClick={() => onChange(l)}
        >
          {l === "en" ? "EN" : "한"}
        </button>
      ))}
    </div>
  );
}

export function FontSizeButtons({ scale, onChange }: { scale: FontScale; onChange: (s: FontScale) => void }) {
  return (
    <div className={styles.sizes}>
      <button type="button" aria-label="글자 작게" disabled={scale === 0} onClick={() => onChange((scale - 1) as FontScale)}>
        <span className={styles.small}>A-</span>
      </button>
      <button type="button" aria-label="글자 크게" disabled={scale === 2} onClick={() => onChange((scale + 1) as FontScale)}>
        <span className={styles.large}>A+</span>
      </button>
    </div>
  );
}
