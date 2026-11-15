"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Passage, PracticeItem, TalkQuestion, WriteItem } from "@/entities/passage";
import { fetchProgress, saveProgress } from "@/shared/api/progress";
import type { CheckResult } from "@/shared/api/services";
import type { FontScale, Lang } from "@/shared/layout/ReadingControls";

export type { FontScale, Lang };

export interface SessionState {
  ready: boolean;
  passageId: string | null;
  talk: TalkQuestion[];
  practice: PracticeItem[];
  write: WriteItem[];
  studyAnswers: Record<string, string>;
  practiceAnswers: Record<string, string>;
  practiceResults: Record<string, CheckResult>;
  writeAnswers: Record<string, string>;
  writeResults: Record<string, CheckResult>;
  lang: Lang;
  fontScale: FontScale;
}

const empty: SessionState = {
  ready: false,
  passageId: null,
  talk: [],
  practice: [],
  write: [],
  studyAnswers: {},
  practiceAnswers: {},
  practiceResults: {},
  writeAnswers: {},
  writeResults: {},
  lang: "en",
  fontScale: 1,
};

type Action =
  | { type: "hydrate"; state: SessionState }
  | { type: "start"; passage: Passage }
  | { type: "set"; patch: Partial<SessionState> }
  | { type: "addTalk"; items: TalkQuestion[] }
  | { type: "addPractice"; items: PracticeItem[] }
  | { type: "addWrite"; items: WriteItem[] }
  | { type: "answer"; kind: "study" | "practice" | "write"; id: string; value: string }
  | { type: "result"; kind: "practice" | "write"; id: string; value: CheckResult | null };

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case "hydrate":
      return { ...action.state, ready: true };
    case "start":
      return {
        ...empty,
        ready: true,
        passageId: action.passage.id,
        talk: action.passage.talk,
        practice: action.passage.practice,
        write: action.passage.write,
        lang: state.lang,
        fontScale: state.fontScale,
      };
    case "set":
      return { ...state, ...action.patch };
    case "addTalk":
      return { ...state, talk: [...state.talk, ...action.items] };
    case "addPractice":
      return { ...state, practice: [...state.practice, ...action.items] };
    case "addWrite":
      return { ...state, write: [...state.write, ...action.items] };
    case "answer": {
      const key =
        action.kind === "study"
          ? "studyAnswers"
          : action.kind === "practice"
            ? "practiceAnswers"
            : "writeAnswers";
      return { ...state, [key]: { ...state[key], [action.id]: action.value } };
    }
    case "result": {
      const key = action.kind === "practice" ? "practiceResults" : "writeResults";
      const next = { ...state[key] };
      if (action.value) next[action.id] = action.value;
      else delete next[action.id];
      return { ...state, [key]: next };
    }
  }
}

const STORAGE_KEY = "english-meetup:session:v1";

interface SessionApi {
  state: SessionState;
  /** 서버 상태를 받아 온(또는 실패해 로컬로 확정한) 지문 id. 이 값이 passageId와 같아야 화면을 그린다. */
  loadedId: string | null;
  start: (passage: Passage) => void;
  set: (patch: Partial<SessionState>) => void;
  addTalk: (items: TalkQuestion[]) => void;
  addPractice: (items: PracticeItem[]) => void;
  addWrite: (items: WriteItem[]) => void;
  setAnswer: (kind: "study" | "practice" | "write", id: string, value: string) => void;
  setResult: (kind: "practice" | "write", id: string, value: CheckResult | null) => void;
}

const Ctx = createContext<SessionApi | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, empty);

  // 새로고침해도 이어서 쓸 수 있게 sessionStorage에 저장
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        dispatch({ type: "hydrate", state: { ...empty, ...JSON.parse(raw) } });
        return;
      }
    } catch {
      /* 저장소를 못 읽어도 새 세션으로 시작 */
    }
    dispatch({ type: "set", patch: { ready: true } });
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  // 서버가 원본, sessionStorage는 새로고침 복구용 캐시.
  const [loadedId, setLoadedId] = useState<string | null>(null);
  // PUT 허용 지문: GET이 성공했을 때만. 실패 시 서버 진도를 로컬 상태로 덮지 않게 저장 안 함. 같은 커밋의 PUT 효과가 바로 보도록 ref.
  const savableRef = useRef<string | null>(null);
  const pending = useRef<{ id: string; state: SessionState } | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const flush = useCallback((keepalive = false) => {
    const p = pending.current;
    if (!p) return;
    pending.current = null;
    saveProgress(p.id, p.state, { keepalive }).catch((e) => console.warn("진행 상태 저장 실패", e));
  }, []);

  // 지문이 정해지거나 바뀌면 서버 상태를 한 번 받아 온다.
  useEffect(() => {
    const id = state.passageId;
    if (!state.ready || !id) return;
    flush(); // 이전 지문의 디바운스 대기분을 먼저 보낸다
    savableRef.current = null;
    setLoadedId(null);
    const ctrl = new AbortController();
    fetchProgress<SessionState>(id, ctrl.signal)
      .then((remote) => {
        if (ctrl.signal.aborted) return;
        savableRef.current = id;
        if (!remote) return;
        const { lang, fontScale } = stateRef.current;
        // lang·fontScale은 기기 설정이라 다른 기기에서 저장된 값보다 지금 로컬 값을 유지한다.
        dispatch({ type: "hydrate", state: { ...empty, ...remote, passageId: id, lang, fontScale } });
      })
      .catch((e) => {
        if (!ctrl.signal.aborted) console.warn("진행 상태 불러오기 실패, 로컬로 계속(이 지문은 서버 저장 안 함)", e);
      })
      .finally(() => {
        if (ctrl.signal.aborted) return;
        setLoadedId(id);
      });
    return () => ctrl.abort(); // 늦게 온 이전 지문 응답이 현재 상태를 덮지 않게
  }, [state.ready, state.passageId, flush]);

  // 서버 hydrate가 끝난 지문만 800ms 디바운스로 PUT
  useEffect(() => {
    if (!state.ready || !state.passageId || savableRef.current !== state.passageId) return;
    pending.current = { id: state.passageId, state };
    const t = setTimeout(() => flush(), 800);
    return () => clearTimeout(t);
  }, [state, loadedId, flush]);

  // 탭 이탈·언마운트 시 마지막 변경 flush
  useEffect(() => {
    const onHide = () => flush(true);
    const onVis = () => document.visibilityState === "hidden" && flush(true);
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onVis);
      flush(true);
    };
  }, [flush]);

  const start = useCallback((passage: Passage) => dispatch({ type: "start", passage }), []);
  const set = useCallback((patch: Partial<SessionState>) => dispatch({ type: "set", patch }), []);
  const addTalk = useCallback((items: TalkQuestion[]) => dispatch({ type: "addTalk", items }), []);
  const addPractice = useCallback((items: PracticeItem[]) => dispatch({ type: "addPractice", items }), []);
  const addWrite = useCallback((items: WriteItem[]) => dispatch({ type: "addWrite", items }), []);
  const setAnswer = useCallback(
    (kind: "study" | "practice" | "write", id: string, value: string) =>
      dispatch({ type: "answer", kind, id, value }),
    [],
  );
  const setResult = useCallback(
    (kind: "practice" | "write", id: string, value: CheckResult | null) =>
      dispatch({ type: "result", kind, id, value }),
    [],
  );

  const api = useMemo(
    () => ({ state, loadedId, start, set, addTalk, addPractice, addWrite, setAnswer, setResult }),
    [state, loadedId, start, set, addTalk, addPractice, addWrite, setAnswer, setResult],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useSession(): SessionApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSession must be used inside <SessionProvider>");
  return v;
}
