import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "./Button";
import styles from "./LinkButton.module.css";

/** 페이지 이동용 꽉 찬 버튼 (하단 푸터) */
export function LinkButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={styles.link}>
      <Button block>{children}</Button>
    </Link>
  );
}
