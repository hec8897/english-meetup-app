"use client";

import { useEffect, useState } from "react";
import { getPassage, type Passage } from "@/entities/passage";
import { fetchPassage } from "@/shared/api/passages";
import { useSession } from "./session";

// ponytail: 단계 이동마다 다시 받지 않게 모듈 메모리 캐시. 지문은 생성 후 바뀌지 않는다.
const cache = new Map<string, Passage>();

/** 서버에서 지문을 받아요(실패하면 seed). undefined = 받는 중, null = 없음. */
function useRemotePassage(id: string): Passage | null | undefined {
  const [passage, setPassage] = useState<Passage | null | undefined>(() => cache.get(id));
  useEffect(() => {
    const hit = cache.get(id);
    if (hit) {
      setPassage(hit);
      return;
    }
    setPassage(undefined);
    const ctrl = new AbortController();
    fetchPassage<Passage>(id, ctrl.signal)
      .catch((e) => {
        if (ctrl.signal.aborted) return undefined;
        console.warn("지문 불러오기 실패, 기본 지문으로 대체", e);
        const seed = getPassage(id);
        return seed?.available ? seed : null;
      })
      .then((p) => {
        if (ctrl.signal.aborted) return;
        if (p) cache.set(id, p);
        setPassage(p);
      });
    return () => ctrl.abort();
  }, [id]);
  return passage;
}

/** 주소의 지문 id와 세션을 맞춰 줘요. 다른 지문이면 새로 시작. */
export function usePassage(id: string) {
  const { state, loadedId, start } = useSession();
  const passage = useRemotePassage(id);
  useEffect(() => {
    if (state.ready && passage && state.passageId !== id) start(passage);
  }, [state.ready, state.passageId, id, passage, start]);
  // 서버 상태를 받기 전엔 그리지 않는다(입력 중 hydrate로 덮이는 것 방지)
  const synced = !!passage && state.ready && state.passageId === id && loadedId === id;
  return { passage, synced, state };
}
