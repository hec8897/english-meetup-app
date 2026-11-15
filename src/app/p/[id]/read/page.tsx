"use client";

import { PassageGate } from "@/entities/session";
import { ReadStep } from "@/features/read";

export default function Page() {
  return <PassageGate render={ReadStep} />;
}
