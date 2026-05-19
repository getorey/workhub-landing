"use client";

import { motion } from "framer-motion";

const ANDROID_URL =
  "https://github.com/getorey/workhub-landing/releases/download/v0.1.0-android/workhub-android-debug-latest.apk";
// #312 — App Store 정식 출시 (id6768186636). TestFlight URL 제거.
const IOS_APP_STORE_URL = "https://apps.apple.com/kr/app/workhub/id6768186636";
const WINDOWS_EXE_URL =
  "https://github.com/getorey/workhub-landing/releases/download/v0.1.0-windows/workhub-windows-installer-latest.exe";

interface DownloadItem {
  name: string;
  badge: string;
  description: string;
  href: string;
  cta: string;
  /** "베타 검토 중" 같은 임시 상태 라벨 */
  statusLabel?: string;
  icon: React.ReactNode;
}

const items: DownloadItem[] = [
  {
    name: "Android",
    badge: "APK",
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
    name: "iOS",
    badge: "App Store",
    description:
      "iPhone / iPad 용 Workhub. App Store 에서 무료 다운로드. iOS 13.0 이상.",
    href: IOS_APP_STORE_URL,
    cta: "App Store 에서 설치",
    icon: (
      <svg
        className="h-10 w-10 text-gray-100"
        viewBox="0 0 16 18"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path d="M13.094 9.62c-.02-2.06 1.683-3.05 1.76-3.098-.957-1.4-2.45-1.594-2.984-1.617-1.27-.128-2.476.748-3.119.748-.653 0-1.642-.73-2.7-.71-1.391.022-2.674.81-3.39 2.056-1.444 2.5-.369 6.2 1.04 8.237.69.998 1.51 2.119 2.587 2.078 1.04-.043 1.434-.673 2.69-.673 1.246 0 1.61.673 2.708.65 1.119-.02 1.829-1.012 2.51-2.018.79-1.156 1.117-2.288 1.137-2.347-.025-.011-2.183-.84-2.205-3.306zM11.05 3.72c.574-.697.96-1.665.853-2.626-.825.034-1.823.55-2.416 1.247-.531.616-.996 1.6-.87 2.546.92.071 1.857-.467 2.433-1.167z" />
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
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="inline-block rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-gray-300">
                      {item.badge}
                    </span>
                    {item.statusLabel && (
                      <span className="inline-block rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] text-amber-300">
                        {item.statusLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-4 flex-1 text-sm text-gray-400 leading-relaxed">
                {item.description}
              </p>

              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
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
          Android / Windows: 항상 같은 URL — 최신 빌드 자동 갱신.<br className="sm:hidden" />
          iOS: App Store 에서 무료 다운로드.
        </p>
      </div>
    </section>
  );
}
