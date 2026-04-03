"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

type Cell = boolean | string;

interface Row {
  feature: string;
  slack: Cell;
  teams: Cell;
  zulip: Cell;
  mattermost: Cell;
  rocketchat: Cell;
  workhub: Cell;
}

const rows: Row[] = [
  {
    feature: "토픽 기반 정리",
    slack: false,
    teams: false,
    zulip: true,
    mattermost: false,
    rocketchat: false,
    workhub: true,
  },
  {
    feature: "하이브리드 모델",
    slack: false,
    teams: false,
    zulip: false,
    mattermost: false,
    rocketchat: false,
    workhub: true,
  },
  {
    feature: "내장 칸반 보드",
    slack: "연동",
    teams: "연동",
    zulip: false,
    mattermost: true,
    rocketchat: false,
    workhub: true,
  },
  {
    feature: "메시지→태스크",
    slack: true,
    teams: true,
    zulip: false,
    mattermost: false,
    rocketchat: false,
    workhub: true,
  },
  {
    feature: "AI 에이전트 허브",
    slack: "부분",
    teams: "부분",
    zulip: false,
    mattermost: false,
    rocketchat: false,
    workhub: true,
  },
  {
    feature: "MCP/A2A 프로토콜",
    slack: "부분",
    teams: false,
    zulip: false,
    mattermost: false,
    rocketchat: false,
    workhub: true,
  },
  {
    feature: "셀프호스팅",
    slack: false,
    teams: "제한",
    zulip: true,
    mattermost: true,
    rocketchat: true,
    workhub: true,
  },
  {
    feature: "LDAP/SSO 통합",
    slack: true,
    teams: true,
    zulip: true,
    mattermost: true,
    rocketchat: true,
    workhub: true,
  },
  {
    feature: "봇 생태계",
    slack: true,
    teams: true,
    zulip: "일부",
    mattermost: "일부",
    rocketchat: "일부",
    workhub: true,
  },
];

const competitors = [
  "Slack",
  "Teams",
  "Zulip",
  "Mattermost",
  "Rocket.Chat",
  "Workhub",
] as const;

function CellValue({ value }: { value: Cell }) {
  if (value === true) return <span className="text-emerald-400">&#10003;</span>;
  if (value === false) return <span className="text-gray-600">&mdash;</span>;
  return <span className="text-yellow-400 text-xs">{value}</span>;
}

export default function Comparison() {
  return (
    <section id="comparison" className="section-padding">
      <div className="section-container rounded-3xl bg-gray-950/70 px-6 py-16 sm:px-10 ring-1 ring-white/5">
        <SectionHeading
          badge="Comparison"
          title="다른 제품과"
          highlight="비교해 보세요"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="overflow-x-auto rounded-2xl border border-white/10"
        >
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-gray-900/80">
                <th className="px-4 py-4 text-left font-medium text-gray-400">
                  기능
                </th>
                {competitors.map((c) => (
                  <th
                    key={c}
                    className={`px-3 py-4 text-center font-medium ${
                      c === "Workhub"
                        ? "bg-brand-600/20 text-brand-300"
                        : "text-gray-400"
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.feature}
                  className={`border-b border-white/5 ${
                    i % 2 === 0 ? "bg-gray-900/30" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium">{r.feature}</td>
                  <td className="px-3 py-3 text-center">
                    <CellValue value={r.slack} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <CellValue value={r.teams} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <CellValue value={r.zulip} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <CellValue value={r.mattermost} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <CellValue value={r.rocketchat} />
                  </td>
                  <td className="px-3 py-3 text-center bg-brand-600/10">
                    <CellValue value={r.workhub} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
