"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  GitBranch,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Build your Decision DNA",
    description:
      "Tell LifeOS about your goals, personality, priorities and the decision you are facing.",
    icon: BrainCircuit,
  },
  {
    number: "02",
    title: "Explore three futures",
    description:
      "The AI creates multiple realistic scenarios with different risks, opportunities and outcomes.",
    icon: GitBranch,
  },
  {
    number: "03",
    title: "Compare your Life Scores",
    description:
      "See how every path affects your career, finances, learning, health, stress and fulfilment.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Talk to your future self",
    description:
      "Enter a selected future and ask the version of you who has already lived through it.",
    icon: MessageCircleMore,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary">
            How it works
          </p>

          <h2 className="text-gradient mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            From one difficult decision to a clearer future
          </h2>

          <p className="mt-5 text-lg leading-8 text-muted">
            LifeOS converts your goals and priorities into interactive future
            scenarios you can explore, compare and improve.
          </p>
        </motion.div>

        <div className="relative mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-10 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent xl:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -8 }}
                className="glass-panel relative rounded-3xl p-6 transition-colors hover:border-white/25"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-secondary/20 text-secondary">
                    <Icon size={23} />
                  </div>

                  <span className="font-mono text-sm text-muted">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-semibold text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted">
                  {step.description}
                </p>

                <div className="mt-7 h-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${25 * (index + 1)}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      delay: 0.25 + index * 0.1,
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}