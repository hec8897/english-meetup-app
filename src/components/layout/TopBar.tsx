"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import styles from "./TopBar.module.css";

interface Props {
  /** 지정하면 그 주소로, 없으면 브라우저 뒤로가기 */
  backHref?: string;
  right?: ReactNode;
  hideBack?: boolean;
}

export function TopBar({ backHref, right, hideBack }: Props) {
  const router = useRouter();
  const arrow = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
  return (
    <div className={styles.bar}>
      {hideBack ? (
        <span />
      ) : backHref ? (
        <Link href={backHref} className={styles.back} aria-label="뒤로">
          {arrow}
        </Link>
      ) : (
        <button type="button" className={styles.back} aria-label="뒤로" onClick={() => router.back()}>
          {arrow}
        </button>
      )}
      <div className={styles.right}>{right}</div>
    </div>
  );
}
