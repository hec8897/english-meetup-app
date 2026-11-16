import { createHash, timingSafeEqual } from "node:crypto";

// 임시 접근 코드 보호. 2차(로그인) 도입 시 이 파일·src/proxy.ts·/enter 를 통째로 지운다.
// Next 16 proxy 는 Node 런타임이 기본이라 node:crypto 를 그대로 쓴다.

export const PASS_COOKIE = "app_pass";
export const PASS_MAX_AGE = 60 * 60 * 24 * 30;

/** APP_PASSCODE 가 없으면 null — 보호 끔. */
export function passcode(): string | null {
  return process.env.APP_PASSCODE || null;
}

export function hashPasscode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** 입력 코드가 맞는지. 양쪽을 해시해 길이를 맞춘 뒤 상수시간 비교. */
export function checkPasscode(input: string, expected: string): boolean {
  return safeEqual(hashPasscode(input), hashPasscode(expected));
}

/** 쿠키 값(해시 hex)이 유효한지. */
export function checkPassCookie(cookie: string | undefined, expected: string): boolean {
  return !!cookie && safeEqual(cookie, hashPasscode(expected));
}
