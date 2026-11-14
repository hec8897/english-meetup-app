import type { ReactNode } from "react";
import styles from "./Tag.module.css";

export function Tag({ children }: { children: ReactNode }) {
  return <span className={styles.tag}>{children}</span>;
}

export function Pill({ children }: { children: ReactNode }) {
  return <span className={styles.pill}>{children}</span>;
}

export function NumberBadge({ n }: { n: number }) {
  return <span className={styles.num}>{n}</span>;
}

export function Chip({ children, active }: { children: ReactNode; active?: boolean }) {
  return <span className={`${styles.chip} ${active ? styles.chipOn : ""}`}>{children}</span>;
}
