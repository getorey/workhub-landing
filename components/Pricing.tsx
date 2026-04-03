"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const plans = [
  {
    name: "온라인 테스트",
    price: "무료",
    period: "",
    target: "기능을 직접 체험해 보세요",
    features: [
      "프로젝트 생성",
      "채널 생성 및 대화",
      "봇 기능 체험",
      "테스트 공간 — 자료가 삭제될 수 있습니다",
    ],
    cta: "지금 체험하기",
    featured: true,
    href: "#",
    note: "테스트용 환경입니다",
  },
  {
    name: "Community Edition",
    price: "무료",
    period: "(오픈소스)",
    target: "직접 설치해서 운영하는 팀",
    features: [
      "Docker 이미지 배포",
      "전체 기능 제한 없음",
      "데이터 주권 100%",
      "커뮤니티 지원",
    ],
    cta: "준비중",
    featured: false,
    href: null,
    note: null,
  },
  {
    name: "Enterprise",
    price: "문의",
    period: "",
    target: "대규모 조직",
    features: [
      "전용 인스턴스",
      "SLA 99.9%",
      "감사 로그 무제한",
      "전담 기술 지원",
    ],
    cta: "문의하기",
    featured: false,
    href: "mailto:13thathat@gmail.com",
    note: null,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Pricing() {
  return (
    <section id="pricing" className="section-padding">
      <div className="section-container rounded-3xl bg-gray-950/70 px-6 py-16 sm:px-10 ring-1 ring-white/5">
        <SectionHeading
          badge="Pricing"
          title="합리적인"
          highlight="가격 정책"
          description="팀 규모와 요구에 맞는 플랜을 선택하세요."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {plans.map((p) => (
            <motion.div
              key={p.name}
              variants={item}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                p.featured
                  ? "border-brand-500 bg-brand-600/10 shadow-lg shadow-brand-600/10"
                  : "border-white/10 bg-gray-900/50"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-0.5 text-xs font-semibold text-white">
                  인기
                </span>
              )}
              <h3 className="text-lg font-bold">{p.name}</h3>
              <div className="mt-4">
                <span className="text-3xl font-extrabold">{p.price}</span>
                <span className="text-sm text-gray-400">{p.period}</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">{p.target}</p>
              <ul className="mt-6 flex-1 space-y-2">
                {p.features.map((f) => {
                  const isWarning = f.includes("삭제될 수 있습니다");
                  return (
                    <li key={f} className={`flex items-start gap-2 text-sm ${isWarning ? "text-yellow-400/80" : ""}`}>
                      {isWarning ? (
                        <svg className="h-4 w-4 shrink-0 mt-0.5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                      {f}
                    </li>
                  );
                })}
              </ul>
              {p.href ? (
                <a
                  href={p.href}
                  className={`mt-6 block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition ${
                    p.featured
                      ? "bg-brand-600 text-white hover:bg-brand-500"
                      : "border border-white/20 hover:bg-white/5"
                  }`}
                >
                  {p.cta}
                </a>
              ) : (
                <span className="mt-6 block w-full rounded-xl py-2.5 text-center text-sm font-semibold border border-white/10 text-gray-500 cursor-not-allowed">
                  {p.cta}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
