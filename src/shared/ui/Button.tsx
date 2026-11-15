import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  /** 가로로 꽉 채우기 */
  block?: boolean;
  loading?: boolean;
}

export function Button({ variant = "primary", block, loading, className, children, disabled, ...rest }: Props) {
  const cls = [styles.btn, styles[variant], block ? styles.block : "", className ?? ""].join(" ");
  return (
    <button {...rest} className={cls} disabled={disabled || loading} aria-busy={loading || undefined}>
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
