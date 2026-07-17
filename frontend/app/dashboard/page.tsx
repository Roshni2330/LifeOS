"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  GitBranch,
  HeartPulse,
  Sparkles,
  TrendingUp,
  WalletCards,
  WandSparkles,
} from "lucide-react";

const futures = [
  {
    id: "stable",
    title: "Stable Career Path",
    subtitle: "Job-first future",
    score: 84,
    summary:
      "Immediate income, steady growth and lower risk with moderate long-term upside.",
    tags: ["Low risk", "Stable income", "Balanced"],
    gradient: "from-violet-500/25 to-cyan-400/10",
  },
  {
    id: "growth",
    title: "High-Growth Path",
    subtitle: "Focused preparation",
    score: 91,
    summary:
      "Higher learning, stronger long-term career potential and more short-term uncertainty.",
    tags: ["High growth", "More effort", "Best fit"],
    gradient: "from-cyan-400/20 to-emerald-400/10",
  },
  {
    id: "studies",
    title: "Higher Studies Path",
    subtitle: "Deep expertise",
    score: 78,
    summary:
      "Delayed income, stronger specialization and better access to research-oriented roles.",
    tags: ["Specialization", "Delayed income", "Academic"],
    gradient: "from-pink-400/20 to-violet-500/10",
  },
];

const dnaScores = [
  { label: "Risk tolerance", value: 62 },
  { label: "Learning drive", value: 91 },
  { label: "Financial priority", value: 74 },
  { label: "Work-life priority", value: 68 },
];

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute left-[8%] top-[12%] h-80 w-80 rounded-full bg-primary/15 blur-[130px]" />

      <div className="pointer-events-none absolute bottom-[10%] right-[10%] h-80 w-80 rounded-full bg-secondary/10 blur-[130px]" />

      <div className="page-container relative z-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Sparkles size={19} className="text-white" />
            </span>

            <span className="text-lg font-semibold text-white">
              LifeOS <span className="text-secondary">AI</span>
            </span>
          </Link>

          <Link
            href="/onboarding"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-muted transition hover:bg-white/[0.05] hover:text-white"
          >
            Start again
          </Link>
        </header>

        <section className="pt-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary">
            Simulation complete
          </p>

          <h1 className="text-gradient mx-auto mt-4 max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Your possible futures are ready
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
            LifeOS created three future paths based on your goal, priorities and
            current decision.
          </p>
        </section>

        <section className="mt-14 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <article className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/20 text-secondary">
                <BrainCircuit size={22} />
              </div>

              <div>
                <p className="text-sm text-secondary">Decision DNA</p>

                <h2 className="text-xl font-semibold text-white">
                  How you evaluate choices
                </h2>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {dnaScores.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{item.label}</span>

                    <span className="font-semibold text-white">
                      {item.value}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-secondary/15 bg-secondary/[0.05] p-5">
              <p className="text-sm leading-7 text-muted">
                Your profile indicates a strong preference for learning and
                long-term growth, while financial stability still remains
                important.
              </p>
            </div>
          </article>

          <article className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/20 text-secondary">
                <Activity size={22} />
              </div>

              <div>
                <p className="text-sm text-secondary">
                  Life Score overview
                </p>

                <h2 className="text-xl font-semibold text-white">
                  Your strongest future signals
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <ScoreCard
                label="Career growth"
                value="91%"
                icon={TrendingUp}
              />

              <ScoreCard
                label="Financial stability"
                value="74%"
                icon={WalletCards}
              />

              <ScoreCard
                label="Well-being"
                value="68%"
                icon={HeartPulse}
              />

              <ScoreCard
                label="Learning"
                value="94%"
                icon={GitBranch}
              />
            </div>
          </article>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {futures.map((future) => (
            <article
              key={future.id}
              className={`group glass-panel relative overflow-hidden rounded-3xl bg-gradient-to-br ${future.gradient} p-6 transition duration-300 hover:-translate-y-2 hover:border-white/25`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-secondary">{future.subtitle}</p>

                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {future.title}
                  </h2>
                </div>

                <span className="rounded-xl bg-success/10 px-3 py-1 text-sm font-semibold text-success">
                  {future.score}%
                </span>
              </div>

              <p className="mt-5 text-sm leading-7 text-muted">
                {future.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {future.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  style={{ width: `${future.score}%` }}
                />
              </div>

              <Link
                href={`/future/${future.id}`}
                className="mt-7 flex w-fit items-center gap-2 text-sm font-semibold text-primary-light"
              >
                Enter this future

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </article>
          ))}
        </section>

        <section className="glass-panel mt-8 flex flex-col items-start justify-between gap-6 rounded-[32px] p-7 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/20 text-secondary">
              <WandSparkles size={23} />
            </div>

            <div>
              <p className="text-sm text-secondary">
                Butterfly Effect Simulator
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-white">
                See how small habits reshape your future
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                Change your daily study, exercise, project and networking
                habits, then watch your career, learning, stress and regret
                scores update live.
              </p>
            </div>
          </div>

          <Link
            href="/butterfly"
            className="group flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 text-sm font-semibold text-white"
          >
            Try Butterfly Effect

            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </section>
      </div>
    </main>
  );
}

type ScoreCardProps = {
  label: string;
  value: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
};

function ScoreCard({
  label,
  value,
  icon: Icon,
}: ScoreCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/15 text-secondary">
          <Icon size={20} />
        </div>

        <span className="text-2xl font-semibold text-white">{value}</span>
      </div>

      <p className="mt-4 text-sm text-muted">{label}</p>
    </div>
  );
}
