import type { TextareaHTMLAttributes } from "react";
import styles from "./TextArea.module.css";

export function TextArea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...rest} className={`${styles.ta} ${className ?? ""}`} />;
}
