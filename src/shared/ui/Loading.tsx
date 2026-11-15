import styles from "./Loading.module.css";

export function Loading() {
  return <p className={`sub ${styles.loading}`} role="status">불러오는 중…</p>;
}
