"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      {/* Gradient accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      {/* Radial vignette — center dark fading to transparent */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.5) 50%, transparent 100%)",
        }}
      />

      <div className="section-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 inline-block rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
            102개 기능 &middot; 35개 보안 항목 &middot; 오픈소스
          </p>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            대화하고, 정리하고,{" "}
            <span className="gradient-text">실행하세요</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 md:text-xl">
            토픽 기반 대화 정리 + 내장 태스크 관리 + AI 봇 자동화
            <br className="hidden sm:block" />
            하나의 플랫폼에서 팀 협업의 모든 것을 해결합니다.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#pricing"
              className="rounded-xl bg-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-500"
            >
              무료로 시작하기
            </a>
          </div>
        </motion.div>

        {/* Product screenshot placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-gray-900/50 shadow-2xl shadow-brand-600/10">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <div className="h-3 w-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-gray-500">
                workhub.app
              </span>
            </div>
            <div className="flex h-[300px] items-center justify-center p-8 sm:h-[400px]">
              <div className="flex w-full max-w-3xl gap-4">
                {/* Sidebar mock */}
                <div className="hidden w-48 shrink-0 space-y-3 rounded-lg border border-white/5 bg-gray-800/50 p-4 sm:block">
                  <div className="h-3 w-20 rounded bg-brand-500/40" />
                  <div className="h-3 w-28 rounded bg-white/10" />
                  <div className="h-3 w-24 rounded bg-white/10" />
                  <div className="mt-4 h-3 w-16 rounded bg-cyan-400/40" />
                  <div className="h-3 w-32 rounded bg-white/10" />
                  <div className="h-3 w-20 rounded bg-white/10" />
                </div>
                {/* Main area mock */}
                <div className="flex-1 space-y-3 rounded-lg border border-white/5 bg-gray-800/30 p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-brand-500/60" />
                    <div className="h-3 w-32 rounded bg-white/20" />
                  </div>
                  <div className="ml-8 h-3 w-3/4 rounded bg-white/10" />
                  <div className="ml-8 h-3 w-1/2 rounded bg-white/10" />
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-cyan-400/60" />
                    <div className="h-3 w-40 rounded bg-white/20" />
                  </div>
                  <div className="ml-8 h-3 w-2/3 rounded bg-white/10" />
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-purple-400/60" />
                    <div className="h-3 w-28 rounded bg-white/20" />
                  </div>
                  <div className="ml-8 h-3 w-3/5 rounded bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
