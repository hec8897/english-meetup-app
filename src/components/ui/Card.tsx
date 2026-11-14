import type { HTMLAttributes } from "react";
import styles from "./Card.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  /** 안쪽 여백을 줄인 작은 카드 */
  compact?: boolean;
  tone?: "white" | "blue";
}

export function Card({ compact, tone = "white", className, ...rest }: Props) {
  const cls = [styles.card, compact ? styles.compact : "", tone === "blue" ? styles.blue : "", className ?? ""].join(" ");
  return <div {...rest} className={cls} />;
}
