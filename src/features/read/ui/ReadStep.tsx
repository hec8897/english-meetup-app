"use client";

import { Reading } from "@/entities/passage";
import { useSession, type StepProps } from "@/entities/session";
import { Screen } from "@/shared/layout/Screen";
import { FontSizeButtons, LangToggle } from "@/shared/layout/ReadingControls";
import { LinkButton } from "@/shared/ui/LinkButton";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Pill, Tag, TagRow } from "@/shared/ui/Tag";
import styles from "./read.module.css";

export function ReadStep({ id, passage, state }: StepProps) {
  const { set } = useSession();

  return (
    <Screen
      step={0}
      backHref="/"
      topRight={<LangToggle lang={state.lang} onChange={(lang) => set({ lang })} />}
      footer={<LinkButton href={`/p/${id}/talk`}>다 읽었어요</LinkButton>}
    >
      <PageHeader
        eyebrow={
          <TagRow>
            <Tag>{passage.category}</Tag>
            <Pill>{passage.level}</Pill>
          </TagRow>
        }
        title={state.lang === "en" ? passage.title : passage.titleKo}
      />
      <div className={styles.toolbar}>
        <p className="sub">파란 단어를 누르면 뜻이 나와요</p>
        <FontSizeButtons scale={state.fontScale} onChange={(fontScale) => set({ fontScale })} />
      </div>
      <Reading passage={passage} lang={state.lang} scale={state.fontScale} />
    </Screen>
  );
}
