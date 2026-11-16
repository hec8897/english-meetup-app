"use client";

import { useRef } from "react";
import type { Passage } from "./types";
import type { FontScale, Lang } from "@/shared/layout/ReadingControls";
import { splitVocab } from "@/shared/lib/markup";
import { services } from "@/shared/api/services";
import { useToast } from "@/shared/feedback/ToastProvider";
import styles from "./Reading.module.css";

const SIZES = [16, 18, 21];

/** 영어 단어 / 그 사이 조각(공백·구두점)으로 나눠요 */
const WORD = /([A-Za-z][A-Za-z'’-]*)/g;

export function Reading({ passage, lang, scale }: { passage: Passage; lang: Lang; scale: FontScale }) {
  const toast = useToast();
  const seq = useRef(0);
  const paras = lang === "en" ? passage.paragraphsEn : passage.paragraphsKo;

  // [[단어]] 밖의 일반 단어: 누르면 뜻을 찾아와요 (먼저 '찾는 중'을 띄우고, 늦게 온 응답은 버려요)
  const lookup = async (word: string) => {
    const id = ++seq.current;
    toast.showWord(word, "뜻을 찾는 중이에요…");
    try {
      const { ko } = await services.words.lookup({ word });
      if (id === seq.current) toast.showWord(word, ko);
    } catch {
      if (id === seq.current) toast.showWord(word, "뜻을 찾지 못했어요. 잠시 후 다시 눌러 주세요");
    }
  };

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
                    onClick={() => {
                      seq.current++; // 진행 중이던 일반 단어 조회는 무시
                      toast.showWord(s.text, passage.vocab[s.text] ?? "");
                    }}
                  >
                    {s.text}
                  </button>
                ) : (
                  <span key={j}>
                    {s.text.split(WORD).map((t, k) =>
                      k % 2 === 1 ? (
                        <button key={k} type="button" className={styles.tap} onClick={() => lookup(t)}>
                          {t}
                        </button>
                      ) : (
                        t
                      ),
                    )}
                  </span>
                ),
              )
            : p}
        </p>
      ))}
    </article>
  );
}
