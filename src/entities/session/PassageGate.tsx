"use client";

import type { ComponentType } from "react";
import { useParams, notFound } from "next/navigation";
import type { Passage } from "@/entities/passage";
import { Loading } from "@/shared/ui/Loading";
import type { SessionState } from "./session";
import { usePassage } from "./usePassage";

export interface StepProps {
  id: string;
  passage: Passage;
  state: SessionState;
}

/** 단계 페이지 공통: 지문을 서버에서 받아 세션과 맞추고, 없으면 404, 받는/맞추는 중엔 로딩 */
export function PassageGate({ render: Step }: { render: ComponentType<StepProps> }) {
  const { id } = useParams<{ id: string }>();
  const { passage, synced, state } = usePassage(id);
  if (passage === null) notFound();
  if (!passage || !synced) return <Loading />;
  return <Step id={id} passage={passage} state={state} />;
}
