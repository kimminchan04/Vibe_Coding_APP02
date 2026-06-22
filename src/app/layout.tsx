import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "대진밥핏 — 대진대 학식 영양 분석",
  description: "대진대학교 학생을 위한 학식 메뉴 검색, 영양·열량 분석, AI 식단 조언",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="antialiased">
        <div className="mx-auto min-h-screen max-w-[480px] bg-bg pb-20">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
