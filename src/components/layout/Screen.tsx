import type { ReactNode } from "react";
import { Stepper } from "@/components/ui/Stepper";
import { TopBar } from "./TopBar";
import styles from "./Screen.module.css";

interface Props {
  step?: number;
  backHref?: string;
  hideBack?: boolean;
  topRight?: ReactNode;
  children: ReactNode;
  /** 하단에 붙는 버튼 영역 */
  footer?: ReactNode;
}

export function Screen({ step, backHref, hideBack, topRight, children, footer }: Props) {
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <TopBar backHref={backHref} hideBack={hideBack} right={topRight} />
        {step !== undefined ? <Stepper active={step} /> : null}
      </header>
      <main className={styles.main}>{children}</main>
      {footer ? <footer className={styles.footer}>{footer}</footer> : null}
    </div>
  );
}
