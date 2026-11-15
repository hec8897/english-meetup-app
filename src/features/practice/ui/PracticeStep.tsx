"use client";

import { Compose } from "@/entities/passage";
import { useSession, type StepProps } from "@/entities/session";
import { AddQuestion } from "@/shared/feedback/AddQuestion";
import { Screen } from "@/shared/layout/Screen";
import { LinkButton } from "@/shared/ui/LinkButton";
import { PageHeader } from "@/shared/ui/PageHeader";

export function PracticeStep({ id, state }: StepProps) {
  const { setAnswer, setResult, addPractice } = useSession();

  return (
    <Screen
      step={3}
      backHref={`/p/${id}/study`}
      footer={<LinkButton href={`/p/${id}/write`}>다음</LinkButton>}
    >
      <PageHeader title="영어로 한 문장 써 봐요" sub="힌트 표현을 넣어서 영어 한 문장을 만들어 보세요" />
      <Compose
        items={state.practice}
        answers={state.practiceAnswers}
        results={state.practiceResults}
        onAnswer={(k, v) => setAnswer("practice", k, v)}
        onResult={(k, r) => setResult("practice", k, r)}
        placeholder="영어로 써 보세요"
      />
      <AddQuestion kind="practice" passageId={id} existing={state.practice.map((q) => q.ko)} onAdded={addPractice} />
    </Screen>
  );
}
