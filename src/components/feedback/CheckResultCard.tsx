import type { CheckResult } from "@/lib/services";
import styles from "./CheckResultCard.module.css";

export function CheckResultCard({ result, original }: { result: CheckResult; original: string }) {
  const good = result.status === "good";
  return (
    <div className={`${styles.box} ${good ? styles.good : styles.fix}`} role="status">
      <p className={styles.head}>{good ? "👍 잘 썼어요" : result.status === "missing-hint" ? "힌트 표현을 넣어 주세요" : "이렇게 고쳐 보세요"}</p>
      {!good && result.corrected ? (
        <p className={styles.line}>
          <span className={styles.old}>{original}</span>
          <span className={styles.arrow} aria-hidden="true">→</span>
          <strong className={styles.new}>{result.corrected}</strong>
        </p>
      ) : null}
      <p className={styles.reason}>{result.reasonKo}</p>
    </div>
  );
}
