"use client";

import { motion } from "framer-motion";

interface Props {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
}

export default function SectionHeading({
  badge,
  title,
  highlight,
  description,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="mb-16 text-center"
    >
      {badge && (
        <span className="mb-4 inline-block rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1 text-sm text-brand-300">
          {badge}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        {title}{" "}
        {highlight && <span className="gradient-text">{highlight}</span>}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-gray-400">{description}</p>
      )}
    </motion.div>
  );
}
