"use client";

import { PassageGate } from "@/entities/session";
import { WrapStep } from "@/features/wrap";

export default function Page() {
  return <PassageGate render={WrapStep} />;
}
