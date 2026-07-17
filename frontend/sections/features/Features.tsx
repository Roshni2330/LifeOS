"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BrainCircuit,
  GitCompareArrows,
  MessageCircleMore,
  Route,
  WandSparkles,
} from "lucide-react";

const features = [
  {
    title: "Decision DNA",
    description:
      "Understand your risk tolerance, ambition, priorities and decision-making style.",
    icon: BrainCircuit,
  },
  {
    title: "Multiverse Simulation",
    description:
      "Generate three distinct futures based on the choices available to you.",
    icon: WandSparkles,
  },
  {
    title: "Life Score",
    description:
      "Compare career, finance, learning, health, stress, purpose and regret.",
    icon: Activity,
  },
  {
    title: "Butterfly Effect",
    description:
      "Change one habit or decision and watch the entire future update.",
    icon: GitCompareArrows,
  },
  {
    title: "Future Timeline",
    description:
      "Explore major milestones, risks and opportunities across each year.",
    icon: Route,
  },
  {
    title: "Future Self Chat",
    description:
      "Speak with the version of you who has already experienced the selected path.",
    icon: MessageCircleMore,
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]" />

      <div className="page-container relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary">
            Product experience
          </p>

          <h2 className="text-gradient mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Everything you need to understand a life-changing decision
          </h2>

          <p className="mt-5 text-lg leading-8 text-muted">
            LifeOS combines simulation, comparison, explainability and
            conversation into one decision-making experience.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.01,
                }}
                className="group glass-panel relative overflow-hidden rounded-3xl p-7"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-secondary/[0.06] opacity-0 transition duration-300 group-hover:opacity-100" />

                <div className="relative">
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-primary/25 to-secondary/15 text-secondary shadow-lg shadow-primary/10">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted">
                    {feature.description}
                  </p>

                  <div className="mt-7 flex items-center gap-2 text-sm font-medium text-primary-light">
                    Explore feature
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}