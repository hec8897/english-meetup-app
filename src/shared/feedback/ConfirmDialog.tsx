"use client";

import { Button } from "@/shared/ui/Button";
import { useDialog } from "./useDialog";
import styles from "./Modal.module.css";

interface Props {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, description, confirmLabel, cancelLabel = "취소", danger, onConfirm, onCancel }: Props) {
  const ref = useDialog(open, onCancel);
  if (!open) return null;
  return (
    <div className={styles.dim} onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="dlg-title" className={styles.dialog}>
        <h2 id="dlg-title" className={styles.title}>{title}</h2>
        {description ? <p className={styles.desc}>{description}</p> : null}
        <div className={styles.actions}>
          <Button variant="secondary" block onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={danger ? "danger" : "primary"} block onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
