// 프레임워크 무관 모듈(Next/React import 금지) — NestJS 이전 대상.
// Passage 런타임 검증. 생성 결과 최종 확인과 DB 행 읽기에 같이 쓴다.
import { z } from "zod";
import type { Passage } from "@/entities/passage/types";

const str = (max: number) => z.string().trim().min(1).max(max);
const hint = z.object({ phrase: str(100), meaningKo: str(200) });

export const passageSchema: z.ZodType<Passage> = z.object({
  id: z.string().regex(/^\S{1,100}$/),
  title: str(200),
  titleKo: str(200),
  category: z.enum(["Story", "Social News"]),
  level: z.enum(["Easy", "Medium"]),
  minutes: z.number().int().min(1).max(30),
  available: z.boolean(),
  paragraphsEn: z.array(str(2000)).min(1).max(10),
  paragraphsKo: z.array(str(2000)).min(1).max(10),
  vocab: z.record(z.string(), z.string()),
  talk: z.array(z.object({ id: str(100), kind: z.enum(["의견", "경험"]), text: str(300) })).min(1),
  expressions: z
    .array(
      hint.extend({
        id: str(100),
        sourceEn: str(500),
        sourceKo: str(500),
        examples: z
          .array(
            z.object({
              ko: str(300),
              blank: z.object({ before: z.string().max(300), after: z.string().max(300), answer: str(100) }).optional(),
              en: str(300).optional(),
            }),
          )
          .min(1),
      }),
    )
    .min(1),
  practice: z.array(z.object({ id: str(100), ko: str(300), hint, model: str(300) })).min(1),
  write: z.array(z.object({ id: str(100), ko: str(300), hint })).min(1),
});
