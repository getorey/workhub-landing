"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="section-padding">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-600/20 to-cyan-600/10 px-6 py-16 text-center sm:px-12"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-brand-500/20 blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-cyan-500/20 blur-[100px]" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              직접 체험하고, 의견을 들려주세요
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-300 leading-relaxed">
              온라인 테스트 환경에서 Workhub의 주요 기능을 직접 사용해 보세요.
              <br className="hidden sm:block" />
              편의성, 기능, 오류 등 어떤 의견이든 환영합니다.
              <br className="hidden sm:block" />
              여러분의 피드백이 더 나은 Workhub를 만듭니다.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:flex-wrap">
              <a
                href="#pricing"
                className="rounded-xl bg-white px-8 py-3.5 font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                온라인 테스트 시작
              </a>
              <a
                href="https://github.com/getorey/workhub-landing/releases/download/v0.1.0-android/workhub-android-debug-latest.apk"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 font-semibold text-white transition hover:bg-emerald-500"
                download
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M17.5 9.75a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm-11 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm10.75-3.42 1.5-2.59a.5.5 0 0 0-.86-.5l-1.51 2.62A8.27 8.27 0 0 0 12 4.5a8.27 8.27 0 0 0-4.38 1.36L6.11 3.24a.5.5 0 0 0-.86.5l1.5 2.59A7.93 7.93 0 0 0 4 12h16a7.93 7.93 0 0 0-2.75-5.67ZM4 13v6.5A1.5 1.5 0 0 0 5.5 21H6v3a1 1 0 1 0 2 0v-3h2v3a1 1 0 1 0 2 0v-3h2v3a1 1 0 1 0 2 0v-3h.5a1.5 1.5 0 0 0 1.5-1.5V13H4Z" />
                </svg>
                Android 앱 다운로드 (베타)
              </a>
              <a
                href="mailto:13thathat@gmail.com?subject=[Workhub 피드백]&body=안녕하세요, Workhub 테스트 후 의견을 보내드립니다.%0A%0A■ 편의성:%0A%0A■ 기능 요청:%0A%0A■ 오류 사항:%0A"
                className="rounded-xl border border-white/30 px-8 py-3.5 font-semibold transition hover:bg-white/10"
              >
                피드백 보내기
              </a>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              13thathat@gmail.com 으로 직접 메일을 보내셔도 됩니다
              <br />
              <span className="text-xs text-gray-600">
                * Android 앱은 debug 빌드입니다 — 설치 시 &quot;출처를 알 수 없는 앱&quot; 허용 필요
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
