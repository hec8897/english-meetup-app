"use client";

import { useEffect, useRef } from "react";

/** 열릴 때 포커스를 안으로, Esc로 닫기, 닫히면 원래 자리로 포커스 복귀 */
export function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const node = ref.current;
    const focusable = () =>
      Array.from(node?.querySelectorAll<HTMLElement>("button, textarea, input, [href], [tabindex]:not([tabindex='-1'])") ?? []).filter(
        (el) => !el.hasAttribute("disabled"),
      );
    focusable()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeRef.current();
      } else if (e.key === "Tab") {
        const f = focusable();
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [open]);

  return ref;
}
