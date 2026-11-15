"use client";

import type { ReactNode } from "react";
import { useDialog } from "./useDialog";
import styles from "./Modal.module.css";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ open, title, onClose, children }: Props) {
  const ref = useDialog(open, onClose);
  if (!open) return null;
  return (
    <div className={`${styles.dim} ${styles.bottom}`} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="sheet-title" className={styles.sheet}>
        <span className={styles.grab} aria-hidden="true" />
        <h2 id="sheet-title" className={styles.title}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
