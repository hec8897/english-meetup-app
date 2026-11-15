"use client";

import { Compose } from "@/entities/passage";
import { useSession, type StepProps } from "@/entities/session";
import { AddQuestion } from "@/shared/feedback/AddQuestion";
import { Screen } from "@/shared/layout/Screen";
import { LinkButton } from "@/shared/ui/LinkButton";
import { PageHeader } from "@/shared/ui/PageHeader";

export function WriteStep({ id, passage, state }: StepProps) {
  const { setAnswer, setResult, addWrite } = useSession();

  return (
    <Screen
      step={4}
      backHref={`/p/${id}/practice`}
      footer={<LinkButton href={`/p/${id}/wrap`}>마무리하기</LinkButton>}
    >
      <PageHeader title="내 이야기로 넓혀 봐요" sub="표현을 넣어 두세 문장으로 이어 써 보세요" />
      <Compose
        rows={4}
        items={state.write}
        answers={state.writeAnswers}
        results={state.writeResults}
        onAnswer={(k, v) => setAnswer("write", k, v)}
        onResult={(k, r) => setResult("write", k, r)}
        placeholder="두세 문장으로 써 보세요"
      />
      <AddQuestion pool={passage.pool.write} existing={state.write} onAdded={addWrite} />
    </Screen>
  );
}
