"use client";

import { useEffect } from "react";
import { getPassage } from "@/data/passages";
import { useSession } from "./session";

/** 주소의 지문 id와 세션을 맞춰 줘요. 다른 지문이면 새로 시작. */
export function usePassage(id: string) {
  const { state, start } = useSession();
  const passage = getPassage(id);
  useEffect(() => {
    if (state.ready && passage && state.passageId !== id) start(passage);
  }, [state.ready, state.passageId, id, passage, start]);
  const synced = state.ready && state.passageId === id;
  return { passage, synced, state };
}
