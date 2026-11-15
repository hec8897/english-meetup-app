"use client";

import { PassageGate } from "@/entities/session";
import { StudyStep } from "@/features/study";

export default function Page() {
  return <PassageGate render={StudyStep} />;
}
