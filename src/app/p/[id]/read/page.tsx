"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { usePassage } from "@/lib/usePassage";
import { useSession } from "@/lib/session";
import { Screen } from "@/components/layout/Screen";
import { FontSizeButtons, LangToggle } from "@/components/layout/ReadingControls";
import { Reading } from "@/components/passage/Reading";
import { Loading } from "@/components/passage/Loading";
import { Button } from "@/components/ui/Button";
import { Pill, Tag } from "@/components/ui/Tag";

export default function ReadPage() {
  const { id } = useParams<{ id: string }>();
  const { passage, synced, state } = usePassage(id);
  const { set } = useSession();
  if (!passage) notFound();
  if (!synced) return <Loading />;

  return (
    <Screen
      step={0}
      backHref="/"
      topRight={<LangToggle lang={state.lang} onChange={(lang) => set({ lang })} />}
      footer={
        <Link href={`/p/${id}/talk`} style={{ display: "flex", flex: 1 }}>
          <Button block>다 읽었어요</Button>
        </Link>
      }
    >
      <div className="stack" style={{ gap: 8 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <Tag>{passage.category}</Tag>
          <Pill>{passage.level}</Pill>
        </div>
        <h1 className="page-title">{state.lang === "en" ? passage.title : passage.titleKo}</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p className="sub">파란 단어를 누르면 뜻이 나와요</p>
        <FontSizeButtons scale={state.fontScale} onChange={(fontScale) => set({ fontScale })} />
      </div>
      <Reading passage={passage} lang={state.lang} scale={state.fontScale} />
    </Screen>
  );
}
