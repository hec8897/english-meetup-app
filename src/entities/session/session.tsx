"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Passage, PracticeItem, TalkQuestion, WriteItem } from "@/entities/passage";
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
    () => ({ state, start, set, addTalk, addPractice, addWrite, setAnswer, setResult }),
    [state, start, set, addTalk, addPractice, addWrite, setAnswer, setResult],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useSession(): SessionApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSession must be used inside <SessionProvider>");
  return v;
}
