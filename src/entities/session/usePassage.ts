"use client";

import { useEffect } from "react";
import { getPassage } from "@/entities/passage";
import { useSession } from "./session";

/** 주소의 지문 id와 세션을 맞춰 줘요. 다른 지문이면 새로 시작. */
export function usePassage(id: string) {
  const { state, loadedId, start } = useSession();
  const passage = getPassage(id);
  useEffect(() => {
    if (state.ready && passage && state.passageId !== id) start(passage);
  }, [state.ready, state.passageId, id, passage, start]);
  // 서버 상태를 받기 전엔 그리지 않는다(입력 중 hydrate로 덮이는 것 방지)
  const synced = state.ready && state.passageId === id && loadedId === id;
  return { passage, synced, state };
}
