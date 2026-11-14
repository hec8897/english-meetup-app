import styles from "./BlankInput.module.css";

interface Props {
  before: string;
  after: string;
  value: string;
  onChange: (v: string) => void;
  label: string;
}

/** 문장 속 빈칸에 표현을 직접 써 보는 입력 */
export function BlankInput({ before, after, value, onChange, label }: Props) {
  return (
    <p className={styles.line}>
      <span>{before}</span>
      <input
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        size={Math.max(8, value.length + 1)}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
      />
      <span>{after}</span>
    </p>
  );
}
