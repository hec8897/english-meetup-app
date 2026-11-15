export type Category = "Story" | "Social News";
export type Level = "Easy" | "Medium";
export type TalkKind = "의견" | "경험";

export interface Hint {
  phrase: string;
  meaningKo: string;
}

export interface TalkQuestion {
  id: string;
  kind: TalkKind;
  text: string;
}

export interface ExampleBlank {
  before: string;
  after: string;
  answer: string;
}

export interface ExpressionExample {
  ko: string;
  /** 빈칸이 있는 예문이면 blank, 없으면 en 문장에서 표현을 굵게 표시 */
  blank?: ExampleBlank;
  en?: string;
}

export interface Expression extends Hint {
  id: string;
  sourceEn: string;
  sourceKo: string;
  examples: ExpressionExample[];
}

export interface PracticeItem {
  id: string;
  ko: string;
  hint: Hint;
  /** 예시 답안 */
  model: string;
}

export interface WriteItem {
  id: string;
  ko: string;
  hint: Hint;
}

export interface Passage {
  id: string;
  title: string;
  titleKo: string;
  category: Category;
  level: Level;
  minutes: number;
  /** false면 아직 콘텐츠가 없는 지문 (홈에서 "준비 중") */
  available: boolean;
  paragraphsEn: string[];
  paragraphsKo: string[];
  /** 지문에서 누르면 뜻이 나오는 단어. 본문에 [[단어]] 로 표시 */
  vocab: Record<string, string>;
  talk: TalkQuestion[];
  expressions: Expression[];
  practice: PracticeItem[];
  write: WriteItem[];
}
