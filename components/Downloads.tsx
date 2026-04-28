"use client";

import { motion } from "framer-motion";

const ANDROID_URL =
  "https://github.com/getorey/workhub-landing/releases/download/v0.1.0-android/workhub-android-debug-latest.apk";
const WINDOWS_EXE_URL =
  "https://github.com/getorey/workhub-landing/releases/download/v0.1.0-windows/workhub-windows-installer-latest.exe";

const items = [
  {
    name: "Android",
    badge: "APK (debug)",
    description:
      "스마트폰 / 태블릿용 Workhub 앱. APK 설치 시 \"알 수 없는 출처 허용\" 이 필요할 수 있습니다.",
    href: ANDROID_URL,
    cta: "Android APK 다운로드",
    icon: (
      <svg
        className="h-10 w-10 text-emerald-400"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M17.6 9.48l1.84-3.18a.4.4 0 1 0-.69-.4L16.91 9.1A11.43 11.43 0 0 0 12 8a11.43 11.43 0 0 0-4.91 1.1L5.25 5.9a.4.4 0 1 0-.69.4l1.84 3.18A11 11 0 0 0 1 19h22a11 11 0 0 0-5.4-9.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
      </svg>
    ),
  },
  {
    name: "Windows",
    badge: "EXE Installer",
    description:
      "Windows 10/11 데스크톱용 Workhub 앱. 첫 실행 시 SmartScreen 경고가 뜨면 \"추가 정보 → 실행\" 으로 진행하세요.",
    href: WINDOWS_EXE_URL,
    cta: "Windows EXE 다운로드",
    icon: (
      <svg
        className="h-10 w-10 text-cyan-400"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M3 5.5L10.5 4.4v7.1H3V5.5zM3 12.5h7.5v7.1L3 18.5v-6zM11.5 4.25L21 3v8.5h-9.5V4.25zM11.5 12.5H21V21l-9.5-1.25V12.5z" />
      </svg>
    ),
  },
];

export default function Downloads() {
  return (
    <section id="downloads" className="section-padding">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            앱 다운로드
          </h2>
          <p className="mt-4 text-gray-300">
            스마트폰과 PC 어디서든 Workhub 를 사용하세요.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12 grid gap-6 sm:grid-cols-2"
        >
          {items.map((item) => (
            <div
              key={item.name}
              className="flex flex-col rounded-2xl border border-white/10 bg-gray-900/50 p-6 shadow-lg transition hover:border-brand-500/40"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-xl border border-white/10 bg-gray-800/50 p-3">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <span className="mt-1 inline-block rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-gray-300">
                    {item.badge}
                  </span>
                </div>
              </div>

              <p className="mt-4 flex-1 text-sm text-gray-400 leading-relaxed">
                {item.description}
              </p>

              <a
                href={item.href}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                  />
                </svg>
                {item.cta}
              </a>
            </div>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-xs text-gray-500">
          항상 같은 URL — 최신 빌드가 자동으로 갱신됩니다.
        </p>
      </div>
    </section>
  );
}
