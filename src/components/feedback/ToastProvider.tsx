"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import styles from "./Toast.module.css";

type Kind = "info" | "ok" | "err";
interface ToastItem {
  id: number;
  kind: Kind;
  message: string;
  action?: { label: string; onClick: () => void };
}
interface WordToast {
  word: string;
  meaning: string;
}

interface Api {
  show: (message: string, opts?: { kind?: Kind; action?: ToastItem["action"] }) => void;
  /** 지문 단어 뜻 – 상단에 떠 있다가 X로 닫거나 다른 단어를 누르면 교체 */
  showWord: (word: string, meaning: string) => void;
  hideWord: () => void;
}

const Ctx = createContext<Api | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastItem | null>(null);
  const [word, setWord] = useState<WordToast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seq = useRef(0);
  const pathname = usePathname();

  // 화면이 바뀌면 단어 토스트는 닫아요
  useEffect(() => {
    setWord(null);
  }, [pathname]);

  const show = useCallback<Api["show"]>((message, opts) => {
    if (timer.current) clearTimeout(timer.current);
    const kind = opts?.kind ?? "info";
    const id = ++seq.current;
    setToast({ id, kind, message, action: opts?.action });
    timer.current = setTimeout(() => setToast(null), kind === "err" ? 5000 : 3000);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const showWord = useCallback((w: string, meaning: string) => setWord({ word: w, meaning }), []);
  const hideWord = useCallback(() => setWord(null), []);

  const api = useMemo(() => ({ show, showWord, hideWord }), [show, showWord, hideWord]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <div className={styles.topLayer}>
        {word ? (
          <div className={styles.word} role="status" aria-live="polite" key={word.word}>
            <div className={styles.wordText}>
              <strong>{word.word}</strong>
              <span>{word.meaning}</span>
            </div>
            <button type="button" className={styles.x} aria-label="닫기" onClick={hideWord}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
      <div className={styles.bottomLayer}>
        {toast ? (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.kind]}`}
            role={toast.kind === "err" ? "alert" : "status"}
          >
            <span className={styles.icon} aria-hidden="true">
              {toast.kind === "ok" ? "✓" : toast.kind === "err" ? "!" : "i"}
            </span>
            <span className={styles.msg}>{toast.message}</span>
            {toast.action ? (
              <button
                type="button"
                className={styles.action}
                onClick={() => {
                  toast.action?.onClick();
                  setToast(null);
                }}
              >
                {toast.action.label}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): Api {
  const v = useContext(Ctx);
  if (!v) throw new Error("useToast must be used inside <ToastProvider>");
  return v;
}
