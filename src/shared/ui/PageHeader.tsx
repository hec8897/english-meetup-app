import type { ReactNode } from "react";
import styles from "./PageHeader.module.css";

interface Props {
  title: ReactNode;
  sub?: ReactNode;
  /** 제목 위에 붙는 내용 (태그 등) */
  eyebrow?: ReactNode;
}

/** 화면 상단 제목 + 설명 */
export function PageHeader({ title, sub, eyebrow }: Props) {
  return (
    <div className={styles.header}>
      {eyebrow}
      <h1 className="page-title">{title}</h1>
      {sub ? <p className="sub">{sub}</p> : null}
    </div>
  );
}
