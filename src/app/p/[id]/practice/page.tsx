"use client";

import { PassageGate } from "@/entities/session";
import { PracticeStep } from "@/features/practice";

export default function Page() {
  return <PassageGate render={PracticeStep} />;
}
