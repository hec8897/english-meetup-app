import styles from "./Stepper.module.css";

export const STEPS = ["읽기", "나누기", "표현", "연습", "확장", "쓰기"] as const;

export function Stepper({ active }: { active: number }) {
  return (
    <ol className={styles.steps} aria-label="진행 단계">
      {STEPS.map((name, i) => (
        <li
          key={name}
          className={`${styles.step} ${i <= active ? styles.reached : ""} ${i === active ? styles.current : ""}`}
          aria-current={i === active ? "step" : undefined}
        >
          <span className={styles.bar} />
          <span className={styles.label}>{name}</span>
        </li>
      ))}
    </ol>
  );
}
