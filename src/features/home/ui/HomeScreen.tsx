"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { passages as seed, type Passage } from "@/entities/passage";
import { fetchPassageList } from "@/shared/api/passages";
import { useToast } from "@/shared/feedback/ToastProvider";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Pill, Tag, TagRow } from "@/shared/ui/Tag";
import { NewPassageSheet } from "./NewPassageSheet";
import styles from "./home.module.css";

type Summary = Pick<Passage, "id" | "title" | "titleKo" | "category" | "level" | "minutes" | "available">;

export function HomeScreen() {
  const router = useRouter();
  const toast = useToast();
  // seed를 먼저 보여 주고 서버 목록(seed + 생성 지문)으로 바꾼다. 서버 실패 시 seed 그대로.
  const [passages, setPassages] = useState<Summary[]>(seed);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    fetchPassageList<Summary>()
      .then(setPassages)
      .catch((e) => console.warn("지문 목록 불러오기 실패, 기본 지문만 표시", e));
  }, []);

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
                router.push(`/p/${p.id}/read`);
              }}
            >
              <Card className={styles.card}>
                <TagRow>
                  <Tag>{p.category}</Tag>
                  <Pill>{p.level}</Pill>
                  <Pill>{p.minutes}분</Pill>
                </TagRow>
                <h2 className={styles.title}>{p.title}</h2>
                <p className="sub">{p.titleKo}</p>
                {!p.available ? <span className={styles.soon}>준비 중</span> : null}
              </Card>
            </button>
          </li>
        ))}
      </ul>
      <Button variant="secondary" block onClick={() => setSheetOpen(true)}>
        ＋ 새 지문 만들기
      </Button>
      <NewPassageSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onCreated={(p) => {
          // 목록은 항상 seed가 앞(서버 정렬과 같게): seed 바로 뒤에 최신 지문
          setPassages((list) => [...list.slice(0, seed.length), p, ...list.slice(seed.length)]);
          setSheetOpen(false);
        }}
      />
    </div>
  );
}
