"use client";

import { PassageGate } from "@/entities/session";
import { TalkStep } from "@/features/talk";

export default function Page() {
  return <PassageGate render={TalkStep} />;
}
