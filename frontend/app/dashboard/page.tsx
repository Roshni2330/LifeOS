"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

type DecisionDNA = {
  riskTolerance: number;
  learningDrive: number;
  financialPriority: number;
  workLifePriority: number;
};

type LifeScores = {
  career: number;
  finance: number;
  learning: number;
  health: number;
  stress: number;
};

type Future = {
  id: string;
  title: string;
  subtitle: string;
  score: number;
  summary: string;
  tags: string[];
};

type Simulation = {
  decisionDNA: DecisionDNA;
  lifeScores: LifeScores;
  recommendation: string;
  timeline: string[];
  futures: Future[];
};

type StoredSimulation = {
  success?: boolean;
  simulation?: Simulation;
};

const futureGradients = [
  "from-cyan-400/20 to-emerald-400/10",
  "from-violet-500/25 to-cyan-400/10",
  "from-pink-400/20 to-violet-500/10",
];

export default function DashboardPage() {
  const router = useRouter();

  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    try {
      const storedData =
        localStorage.getItem("lifeos-dashboard") ||
        localStorage.getItem("lifeos-simulation");

      if (!storedData) {
        setLoadError("No simulation data was found.");
        setIsLoading(false);
        return;
      }

      const parsed = JSON.parse(storedData) as StoredSimulation | Simulation;

      const simulationData =
        "simulation" in parsed && parsed.simulation
          ? parsed.simulation
          : (parsed as Simulation);

      if (
        !simulationData?.decisionDNA ||
        !simulationData?.lifeScores ||
        !Array.isArray(simulationData?.futures)
      ) {
        throw new Error("The saved simulation data is incomplete.");
      }

      setSimulation(simulationData);
    } catch (error) {
      console.error("Failed to load dashboard simulation:", error);

      setLoadError(
        error instanceof Error
          ? error.message
          : "Failed to load your AI simulation.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <section className="glass-panel max-w-xl rounded-[32px] p-10 text-center">
          <div className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
            <Sparkles size={28} className="text-white" />
          </div>

          <h1 className="text-gradient mt-6 text-4xl font-semibold">
            Loading your AI futures
          </h1>

          <p className="mt-4 text-muted">
            Preparing your Decision DNA and simulated life paths.
          </p>
        </section>
      </main>
    );
  }

  if (!simulation || loadError) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <section className="glass-panel max-w-xl rounded-[32px] p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
            <BrainCircuit size={28} className="text-white" />
          </div>

          <h1 className="text-gradient mt-6 text-4xl font-semibold">
            Simulation data unavailable
          </h1>

          <p className="mt-4 text-muted">
            {loadError || "Please create a new simulation first."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/onboarding")}
            className="mt-7 rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white"
          >
            Start a new simulation
          </button>
        </section>
      </main>
    );
  }

  const dnaScores = [
    {
      label: "Risk tolerance",
      value: simulation.decisionDNA.riskTolerance,
    },
    {
      label: "Learning drive",
      value: simulation.decisionDNA.learningDrive,
    },
    {
      label: "Financial priority",
      value: simulation.decisionDNA.financialPriority,
    },
    {
      label: "Work-life priority",
      value: simulation.decisionDNA.workLifePriority,
    },
  ];

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
            AI simulation complete
          </p>

          <h1 className="text-gradient mx-auto mt-4 max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Your possible futures are ready
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
            LifeOS created personalized future paths using your goal, decision
            options and priorities.
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
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-secondary/15 bg-secondary/[0.05] p-5">
              <p className="text-sm leading-7 text-muted">
                {simulation.recommendation}
              </p>
            </div>
          </article>

          <article className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/20 text-secondary">
                <Activity size={22} />
              </div>

              <div>
                <p className="text-sm text-secondary">Life Score overview</p>

                <h2 className="text-xl font-semibold text-white">
                  Your strongest future signals
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <ScoreCard
                label="Career growth"
                value={`${simulation.lifeScores.career}%`}
                icon={TrendingUp}
              />

              <ScoreCard
                label="Financial stability"
                value={`${simulation.lifeScores.finance}%`}
                icon={WalletCards}
              />

              <ScoreCard
                label="Well-being"
                value={`${simulation.lifeScores.health}%`}
                icon={HeartPulse}
              />

              <ScoreCard
                label="Learning"
                value={`${simulation.lifeScores.learning}%`}
                icon={GitBranch}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Estimated stress</span>
                <span className="text-xl font-semibold text-white">
                  {simulation.lifeScores.stress}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  style={{ width: `${simulation.lifeScores.stress}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-muted">
                Lower stress generally indicates a more sustainable path.
              </p>
            </div>
          </article>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {simulation.futures.map((future, index) => (
            <article
              key={`${future.id}-${index}`}
              className={`group glass-panel relative overflow-hidden rounded-3xl bg-gradient-to-br ${
                futureGradients[index % futureGradients.length]
              } p-6 transition duration-300 hover:-translate-y-2 hover:border-white/25`}
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
                {(future.tags || []).map((tag) => (
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
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
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

        <section className="glass-panel mt-8 rounded-[32px] p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-secondary">
            AI future timeline
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Suggested milestones for your journey
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-5">
            {simulation.timeline.map((milestone, index) => (
              <div
                key={`${milestone}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <span className="text-xs font-semibold text-secondary">
                  STEP {index + 1}
                </span>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {milestone}
                </p>
              </div>
            ))}
          </div>
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