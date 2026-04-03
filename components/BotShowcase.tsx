"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const bots = [
  {
    emoji: "\ud83d\udccb",
    name: "\ub370\uc77c\ub9ac \uc2a4\ud0e0\ub4dc\uc5c5",
    desc: "\ub9e4\uc77c \uc544\uce68 \uc790\ub3d9 \uc9c8\ubb38, \ub9ac\ud3ec\ud2b8 \uc790\ub3d9 \uac8c\uc2dc",
  },
  {
    emoji: "\ud83d\udcca",
    name: "\ud22c\ud45c/\uc124\ubb38",
    desc: "\ucc44\ub110 \ud22c\ud45c + DM \uc124\ubb38 \uc9c0\uc6d0",
  },
  {
    emoji: "\ud83d\udcec",
    name: "\ucde8\ud569 \ubd07",
    desc: "\uc8fc\uac04 \ubcf4\uace0 \uc790\ub3d9 \uc218\uc9d1 \ubc0f \uc694\uc57d",
  },
  {
    emoji: "\u23f0",
    name: "\ud0dc\uc2a4\ud06c \uc54c\ub9bc",
    desc: "\ub9c8\uac10 \uc784\ubc15 DM \uc54c\ub9bc \uc790\ub3d9 \ubc1c\uc1a1",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function BotShowcase() {
  return (
    <section id="bots" className="section-padding">
      <div className="section-container rounded-3xl bg-gray-950/70 px-6 py-16 sm:px-10 ring-1 ring-white/5">
        <SectionHeading
          badge="AI Bot System"
          title="봇이 팀을"
          highlight="자동화합니다"
          description="플랫폼 봇으로 바로 시작하고, Bot API로 나만의 봇도 만들 수 있습니다."
        />

        {/* 4 platform bots */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-4 grid-cols-2 md:grid-cols-4"
        >
          {bots.map((b) => (
            <motion.div
              key={b.name}
              variants={item}
              className="rounded-2xl border border-white/10 bg-gray-900/50 p-5 text-center transition hover:border-brand-500/30 hover:bg-gray-900/80"
            >
              <span className="text-4xl">{b.emoji}</span>
              <h3 className="mt-4 font-bold">{b.name}</h3>
              <p className="mt-2 text-sm text-gray-400">{b.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Custom bot highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 rounded-2xl border border-brand-500/30 bg-gradient-to-r from-brand-600/10 to-cyan-600/10 p-6"
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <span className="text-4xl">&#x1f6e0;&#xfe0f;</span>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold">
                커스텀 봇 개발
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                REST API + WebSocket으로 나만의 봇을 만들어 팀에 연결하세요. 플랫폼 봇과 동일한 Bot API를 사용해 채널 메시지, 태스크 생성, DM 발송까지 자유롭게 자동화할 수 있습니다.
              </p>
            </div>
            <div className="shrink-0">
              <span className="rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-300">
                Bot API
              </span>
            </div>
          </div>
        </motion.div>

        {/* MCP/A2A banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-5 text-center"
        >
          <p className="text-gray-300">
            <span className="font-semibold text-brand-400">MCP/A2A 프로토콜 지원</span>
            {" — "}ChatGPT, Claude, Gemini 등 외부 AI가 Workhub를 도구로 사용할 수 있습니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
