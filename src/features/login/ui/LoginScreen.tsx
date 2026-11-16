"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/shared/ui/Button";
import styles from "./login.module.css";

export function LoginScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: code }),
    }).catch(() => null);
    if (res?.ok) {
      router.replace("/");
      return;
    }
    setLoading(false);
    setError(true);
  }

  return (
    <form className={styles.wrap} onSubmit={submit}>
      <header className={styles.head}>
        <p className="sub">영어 모임</p>
        <h1 className="page-title">로그인</h1>
      </header>
      <input
        className={styles.input}
        type="password"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        aria-label="비밀번호"
        aria-invalid={error || undefined}
        placeholder="비밀번호"
        autoComplete="current-password"
        autoFocus
      />
      {error ? <p className={styles.error} role="alert">비밀번호가 맞지 않아요</p> : null}
      <Button type="submit" block loading={loading} disabled={!code}>
        로그인
      </Button>
    </form>
  );
}
