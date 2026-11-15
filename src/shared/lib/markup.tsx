import type { ReactNode } from "react";

/** **굵게** 표시를 <strong>으로 */
export function renderBold(text: string, className?: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className={className}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/** [[단어]] 를 눌러 볼 수 있는 조각으로 나눠요 */
export function splitVocab(text: string): { text: string; vocab: boolean }[] {
  return text
    .split(/(\[\[[^\]]+\]\])/g)
    .filter(Boolean)
    .map((p) => (p.startsWith("[[") ? { text: p.slice(2, -2), vocab: true } : { text: p, vocab: false }));
}
