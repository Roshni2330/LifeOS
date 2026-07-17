"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  GitBranch,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";

const futurePaths = [
  {
    title: "Corporate Future",
    subtitle: "Stable growth",
    score: "84%",
    position: "left-0 top-20",
    delay: 0.2,
  },
  {
    title: "Startup Future",
    subtitle: "Maximum learning",
    score: "91%",
    position: "right-0 top-4",
    delay: 0.4,
  },
  {
    title: "Higher Studies",
    subtitle: "Deep expertise",
    score: "78%",
    position: "right-8 bottom-0",
    delay: 0.6,
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-40 lg:pt-44">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[20%] h-72 w-72 rounded-full bg-primary/20 blur-[110px]" />
        <div className="absolute right-[8%] top-[15%] h-72 w-72 rounded-full bg-secondary/15 blur-[110px]" />
        <div className="absolute bottom-[8%] left-[40%] h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />
      </div>

      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.16) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />

      <div className="page-container relative z-10 grid min-h-[calc(100vh-8rem)] items-center gap-16 pb-20 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left content */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mt-6 mb-6 flex w-fit items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-4 py-2 text-sm text-secondary lg:mx-0"
          >
            <Sparkles size={15} />
            AI-powered digital twin
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-gradient text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl"
          >
            Experience your future before you live it.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-muted lg:mx-0"
          >
            Create your AI digital twin, simulate multiple life paths, compare
            major decisions and speak with the version of you who has already
            lived them.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link
              href="/onboarding"
              className="group flex h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary px-7 font-semibold text-white shadow-[0_0_45px_rgba(139,92,246,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(34,211,238,0.35)]"
            >
              Create my digital twin
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#how-it-works"
              className="flex h-13 items-center justify-center rounded-2xl border border-border bg-white/[0.03] px-7 font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/[0.07]"
            >
              See how it works
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm text-muted lg:justify-start"
          >
            <span className="flex items-center gap-2">
              <BrainCircuit size={16} className="text-primary-light" />
              Decision DNA
            </span>

            <span className="flex items-center gap-2">
              <GitBranch size={16} className="text-secondary" />
              Multiple futures
            </span>

            <span className="flex items-center gap-2">
              <MessageCircleMore size={16} className="text-accent" />
              Talk to future you
            </span>
          </motion.div>
        </div>

        {/* Right visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="relative mx-auto h-[490px] w-full max-w-[520px]"
        >
          {/* Orbit rings */}
          <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20" />

          <div className="absolute left-1/2 top-1/2 h-[270px] w-[270px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary/20" />

          {/* Main digital twin */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              boxShadow: [
                "0 0 40px rgba(139,92,246,0.16)",
                "0 0 70px rgba(34,211,238,0.24)",
                "0 0 40px rgba(139,92,246,0.16)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="glass-panel absolute left-1/2 top-1/2 z-20 flex h-52 w-52 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30">
              <Sparkles size={30} className="text-white" />
            </div>

            <p className="mt-4 text-xs uppercase tracking-[0.28em] text-secondary">
              Digital Twin
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Future You
            </h2>

            <p className="mt-1 text-sm text-muted">2035 simulation</p>
          </motion.div>

          {/* Future path cards */}
          {futurePaths.map((future) => (
            <motion.div
              key={future.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: [0, -7, 0],
              }}
              transition={{
                opacity: {
                  duration: 0.5,
                  delay: future.delay,
                },
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: future.delay,
                },
              }}
              className={`glass-panel absolute ${future.position} z-30 w-48 rounded-2xl p-4`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {future.title}
                  </p>
                  <p className="mt-1 text-xs text-muted">{future.subtitle}</p>
                </div>

                <span className="rounded-lg bg-success/10 px-2 py-1 text-xs font-semibold text-success">
                  {future.score}
                </span>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-primary to-secondary" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}