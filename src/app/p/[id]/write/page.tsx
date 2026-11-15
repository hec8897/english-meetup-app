"use client";

import { PassageGate } from "@/entities/session";
import { WriteStep } from "@/features/write";

export default function Page() {
  return <PassageGate render={WriteStep} />;
}
