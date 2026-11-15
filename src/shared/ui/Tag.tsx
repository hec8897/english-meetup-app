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

/** 번호 배지 + 오른쪽 내용 한 줄 */
export function NumberedRow({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className={styles.numbered}>
      <NumberBadge n={n} />
      {children}
    </div>
  );
}

/** Tag·Pill을 가로로 나열 */
export function TagRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}

export function Chip({ children, active }: { children: ReactNode; active?: boolean }) {
  return <span className={`${styles.chip} ${active ? styles.chipOn : ""}`}>{children}</span>;
}
