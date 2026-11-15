import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SessionProvider } from "@/entities/session";
import { ToastProvider } from "@/shared/feedback/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "영어 모임",
  description: "지문을 읽고, 이야기하고, 표현을 내 문장으로 써 보는 영어 모임 앱",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f2f4f6",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>
          <ToastProvider>
            <div className="frame">{children}</div>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
