import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Workhub — 대화하고, 정리하고, 실행하세요",
  description:
    "토픽 기반 대화 정리 + 내장 태스크 관리 + AI 봇 자동화. 하나의 플랫폼에서 팀 협업의 모든 것을 해결합니다.",
  openGraph: {
    title: "Workhub — 차세대 업무 협업 플랫폼",
    description:
      "토픽 기반 대화 정리 + 내장 태스크 관리 + AI 봇 자동화",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className={`${geistSans.variable} font-sans`}>{children}</body>
    </html>
  );
}
