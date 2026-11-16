"use client";

import { useRef, type ReactNode } from "react";
import { services } from "@/shared/api/services";
import { useToast } from "@/shared/feedback/ToastProvider";
import styles from "./TapWords.module.css";

/** 영어 단어 / 그 사이 조각(공백·구두점)으로 나눠요 */
const WORD = /([A-Za-z][A-Za-z'’-]*)/g;

/** 단어를 누르면 뜻을 찾아 단어 토스트로 보여줘요. 늦게 온 응답은 버려요. */
export function useWordLookup() {
  const toast = useToast();
  const seq = useRef(0);
  return async (word: string) => {
    const id = ++seq.current;
    toast.showWord(word, "뜻을 찾는 중이에요…");
    try {
      const { ko } = await services.words.lookup({ word });
      if (id === seq.current) toast.showWord(word, ko);
    } catch {
      if (id === seq.current) toast.showWord(word, "뜻을 찾지 못했어요. 잠시 후 다시 눌러 주세요");
    }
  };
}

/** 영어 문장의 모든 단어를 눌러 뜻을 볼 수 있게 해요. **굵게** 표시는 markClassName 으로 강조해요. */
export function TapWords({ text, markClassName }: { text: string; markClassName?: string }) {
  const lookup = useWordLookup();
  const words = (t: string): ReactNode[] =>
    t.split(WORD).map((s, i) =>
      i % 2 === 1 ? (
        <button key={i} type="button" className={styles.tap} onClick={() => lookup(s)}>
          {s}
        </button>
      ) : (
        s
      ),
    );

  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className={markClassName}>
            {words(part.slice(2, -2))}
          </strong>
        ) : (
          <span key={i}>{words(part)}</span>
        ),
      )}
    </>
  );
}
