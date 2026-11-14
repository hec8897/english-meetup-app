"use client";

import { useRouter } from "next/navigation";
import { passages } from "@/data/passages";
import { useSession } from "@/lib/session";
import { useToast } from "@/components/feedback/ToastProvider";
import { Card } from "@/components/ui/Card";
import { Pill, Tag } from "@/components/ui/Tag";
import styles from "./home.module.css";

export default function Home() {
  const router = useRouter();
  const { start } = useSession();
  const toast = useToast();

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <p className="sub">영어 모임</p>
        <h1 className="page-title">오늘은 어떤 글을<br />읽어 볼까요?</h1>
      </header>
      <ul className={styles.list}>
        {passages.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className={styles.item}
              onClick={() => {
                if (!p.available) {
                  toast.show("준비 중인 지문이에요", { kind: "info" });
                  return;
                }
                start(p);
                router.push(`/p/${p.id}/read`);
              }}
            >
              <Card className={styles.card}>
                <div className={styles.tags}>
                  <Tag>{p.category}</Tag>
                  <Pill>{p.level}</Pill>
                  <Pill>{p.minutes}분</Pill>
                </div>
                <h2 className={styles.title}>{p.title}</h2>
                <p className="sub">{p.titleKo}</p>
                {!p.available ? <span className={styles.soon}>준비 중</span> : null}
              </Card>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
