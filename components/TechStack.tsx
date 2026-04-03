"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const stack = [
  {
    name: "Go",
    desc: "모듈러 모노리스, 단일 바이너리",
    color: "text-cyan-400",
  },
  {
    name: "PostgreSQL",
    desc: "안정적 영속성 데이터 저장",
    color: "text-blue-400",
  },
  {
    name: "Redis",
    desc: "고속 캐시 & 세션 관리",
    color: "text-red-400",
  },
  {
    name: "NATS",
    desc: "Go 네이티브, sub-ms 메시지 브로커",
    color: "text-green-400",
  },
  {
    name: "Centrifugo",
    desc: "1만 동시접속/vCPU 실시간 엔진",
    color: "text-orange-400",
  },
  {
    name: "Zitadel",
    desc: "Go 네이티브 SSO/LDAP 인증",
    color: "text-purple-400",
  },
  {
    name: "Meilisearch",
    desc: "Rust 기반 50ms 이하 한국어 검색",
    color: "text-pink-400",
  },
  {
    name: "SeaweedFS",
    desc: "S3 호환 대용량 파일 저장",
    color: "text-yellow-400",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function TechStack() {
  return (
    <section id="tech" className="section-padding">
      <div className="section-container rounded-3xl bg-gray-950/70 px-6 py-16 sm:px-10 ring-1 ring-white/5">
        <SectionHeading
          badge="Tech Stack"
          title="검증된 오픈소스"
          highlight="8종 조합"
          description="각 영역 최적의 솔루션을 선택해 기술 위험을 최소화했습니다."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stack.map((s) => (
            <motion.div
              key={s.name}
              variants={item}
              className="rounded-xl border border-white/10 bg-gray-900/50 p-5 transition hover:border-white/20"
            >
              <h3 className={`text-lg font-bold ${s.color}`}>{s.name}</h3>
              <p className="mt-1 text-sm text-gray-400">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
