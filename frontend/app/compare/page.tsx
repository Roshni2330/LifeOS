"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  GitCompareArrows,
  LoaderCircle,
  Sparkles,
  Trophy,
} from "lucide-react";

type Future = {
  id: string;
  title: string;
  subtitle: string;
  score: number;
  summary: string;
  tags: string[];
};

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

type Simulation = {
  decisionDNA: DecisionDNA;
  lifeScores: LifeScores;
  recommendation?: string;
  timeline?: string[];
  futures: Future[];
};

type StoredSimulation = {
  success?: boolean;
  simulation?: Simulation;
};

type ComparisonScores = {
  career: number;
  finance: number;
  learning: number;
  wellbeing: number;
  relationships: number;
  stress: number;
  regret: number;
};

type Comparison = {
  winnerId: string;
  confidence: number;
  explanation: string;
  tradeoff: string;
  categoryWinners: Record<string, string>;
  scores: {
    left: ComparisonScores;
    right: ComparisonScores;
  };
};

type UserProfile = {
  name?: string;
  age?: string | number;
  currentRole?: string;
  mainGoal?: string;
  decision?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

const scoreLabels = [
  { key: "career" as const, label: "Career growth", positive: true },
  { key: "finance" as const, label: "Financial stability", positive: true },
  { key: "learning" as const, label: "Learning", positive: true },
  { key: "wellbeing" as const, label: "Well-being", positive: true },
  { key: "relationships" as const, label: "Relationships", positive: true },
  { key: "stress" as const, label: "Stress", positive: false },
  { key: "regret" as const, label: "Regret risk", positive: false },
];

export default function ComparePage() {
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");
  const [comparison, setComparison] = useState<Comparison | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isComparing, setIsComparing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      const storedSimulation =
        localStorage.getItem("lifeos-dashboard") ||
        localStorage.getItem("lifeos-simulation");

      if (!storedSimulation) {
        setErrorMessage("No simulation data was found.");
        return;
      }

      const parsed = JSON.parse(storedSimulation) as
        | StoredSimulation
        | Simulation;

      const simulationData =
        "simulation" in parsed && parsed.simulation
          ? parsed.simulation
          : (parsed as Simulation);

      if (!Array.isArray(simulationData.futures) || simulationData.futures.length < 2) {
        setErrorMessage("At least two futures are required for comparison.");
        return;
      }

      const storedProfile = localStorage.getItem("lifeos-onboarding");

      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile) as UserProfile);
      }

      setSimulation(simulationData);
      setLeftId(simulationData.futures[0].id);
      setRightId(simulationData.futures[1].id);
    } catch (error) {
      console.error("Failed to load comparison data:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load the comparison page.",
      );
    } finally {
      setIsLoadingPage(false);
    }
  }, []);

  const leftFuture = useMemo(
    () => simulation?.futures.find((future) => future.id === leftId) ?? null,
    [simulation, leftId],
  );

  const rightFuture = useMemo(
    () => simulation?.futures.find((future) => future.id === rightId) ?? null,
    [simulation, rightId],
  );

  useEffect(() => {
    if (!simulation || !leftFuture || !rightFuture || leftFuture.id === rightFuture.id) {
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setIsComparing(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/compare`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            leftFuture,
            rightFuture,
            decisionDNA: simulation.decisionDNA,
            lifeScores: simulation.lifeScores,
            userProfile: {
              name: userProfile.name,
              age: userProfile.age,
              currentRole: userProfile.currentRole,
              goal: userProfile.mainGoal,
              decision: userProfile.decision,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success || !data.comparison) {
          throw new Error(data.message || "AI comparison failed.");
        }

        setComparison(data.comparison as Comparison);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Compare request failed:", error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to compare these futures.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsComparing(false);
        }
      }
    }, 450);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [simulation, leftFuture, rightFuture, userProfile]);

  if (isLoadingPage) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <section className="glass-panel max-w-xl rounded-[32px] p-10 text-center">
          <LoaderCircle size={42} className="mx-auto animate-spin text-secondary" />
          <h1 className="text-gradient mt-6 text-4xl font-semibold">
            Loading Decision Battle
          </h1>
          <p className="mt-4 text-muted">
            Preparing your AI-generated future paths.
          </p>
        </section>
      </main>
    );
  }

  if (!simulation || !leftFuture || !rightFuture) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <section className="glass-panel max-w-xl rounded-[32px] p-10 text-center">
          <BrainCircuit size={42} className="mx-auto text-secondary" />
          <h1 className="text-gradient mt-6 text-4xl font-semibold">
            Comparison unavailable
          </h1>
          <p className="mt-4 text-muted">
            {errorMessage || "Generate your futures first."}
          </p>
          <Link
            href="/onboarding"
            className="mt-7 inline-flex rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white"
          >
            Start a new simulation
          </Link>
        </section>
      </main>
    );
  }

  const winner =
    comparison
      ? simulation.futures.find((future) => future.id === comparison.winnerId)
      : null;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute left-[8%] top-[12%] h-80 w-80 rounded-full bg-primary/15 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-[10%] right-[8%] h-80 w-80 rounded-full bg-secondary/10 blur-[130px]" />

      <div className="page-container relative z-10">
        <header className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to dashboard
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Sparkles size={19} className="text-white" />
            </span>

            <span className="text-lg font-semibold text-white">
              LifeOS <span className="text-secondary">AI</span>
            </span>
          </Link>
        </header>

        <section className="py-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary">
            AI Decision Battle
          </p>

          <h1 className="text-gradient mx-auto mt-4 max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Compare two versions of your future
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
            LifeOS AI evaluates both paths against your goals, priorities and
            Decision DNA.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <FutureSelector
            label="Future A"
            selectedId={leftId}
            onChange={setLeftId}
            future={leftFuture}
            futures={simulation.futures}
            excludedId={rightId}
          />

          <div className="flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-secondary/20 bg-secondary/[0.08] text-secondary">
              {isComparing ? (
                <LoaderCircle size={25} className="animate-spin" />
              ) : (
                <GitCompareArrows size={25} />
              )}
            </div>
          </div>

          <FutureSelector
            label="Future B"
            selectedId={rightId}
            onChange={setRightId}
            future={rightFuture}
            futures={simulation.futures}
            excludedId={leftId}
          />
        </section>

        {errorMessage && (
          <div className="mt-6 rounded-2xl border border-danger/20 bg-danger/[0.06] p-4 text-sm text-danger">
            {errorMessage}
          </div>
        )}

        <section className="glass-panel mt-8 overflow-hidden rounded-[32px]">
          <div className="grid grid-cols-[1fr_0.75fr_1fr] border-b border-white/10 px-5 py-5 text-center sm:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                Future A
              </p>
              <h2 className="mt-2 font-semibold text-white">
                {leftFuture.title}
              </h2>
            </div>

            <div className="self-center text-sm text-muted">
              {isComparing ? "AI is comparing..." : "Comparison"}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                Future B
              </p>
              <h2 className="mt-2 font-semibold text-white">
                {rightFuture.title}
              </h2>
            </div>
          </div>

          <div className="divide-y divide-white/[0.07]">
            {scoreLabels.map((item) => (
              <BattleRow
                key={item.key}
                label={item.label}
                leftValue={comparison?.scores.left[item.key] ?? 0}
                rightValue={comparison?.scores.right[item.key] ?? 0}
                positive={item.positive}
              />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <article className="glass-panel rounded-3xl p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/10 text-warning">
                <Trophy size={23} />
              </div>

              <div>
                <p className="text-sm text-secondary">Recommended future</p>
                <h2 className="text-2xl font-semibold text-white">
                  {winner?.title || "Waiting for AI"}
                </h2>
              </div>
            </div>

            <div className="mt-7 flex items-end justify-between">
              <div>
                <p className="text-sm text-muted">
                  Recommendation confidence
                </p>
                <p className="mt-2 text-5xl font-semibold text-white">
                  {comparison?.confidence ?? 0}%
                </p>
              </div>

              <div className="rounded-2xl bg-success/10 px-4 py-3 text-center text-success">
                <CheckCircle2 size={24} className="mx-auto" />
                <p className="mt-1 text-xs font-semibold">
                  AI evaluated
                </p>
              </div>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                style={{ width: `${comparison?.confidence ?? 0}%` }}
              />
            </div>
          </article>

          <article className="glass-panel rounded-3xl p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/20 text-secondary">
                <BrainCircuit size={23} />
              </div>

              <div>
                <p className="text-sm text-secondary">AI explanation</p>
                <h2 className="text-2xl font-semibold text-white">
                  Why this path fits better
                </h2>
              </div>
            </div>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              {comparison?.explanation ||
                "LifeOS AI is evaluating the selected futures."}
            </p>

            <div className="mt-6 rounded-2xl border border-secondary/15 bg-secondary/[0.05] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                Important trade-off
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                {comparison?.tradeoff ||
                  "Every path includes meaningful trade-offs."}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={winner ? `/future/${winner.id}` : "/dashboard"}
                className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-white"
              >
                Explore recommended future
              </Link>

              <Link
                href="/dashboard"
                className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/[0.05]"
              >
                View all futures
              </Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

type FutureSelectorProps = {
  label: string;
  selectedId: string;
  onChange: (value: string) => void;
  future: Future;
  futures: Future[];
  excludedId: string;
};

function FutureSelector({
  label,
  selectedId,
  onChange,
  future,
  futures,
  excludedId,
}: FutureSelectorProps) {
  return (
    <article className="glass-panel rounded-3xl p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
        {label}
      </p>

      <select
        value={selectedId}
        onChange={(event) => onChange(event.target.value)}
        className="mt-4 h-12 w-full rounded-2xl border border-white/10 bg-surface-soft px-4 text-sm text-white outline-none focus:border-secondary/40"
      >
        {futures.map((option) => (
          <option
            key={option.id}
            value={option.id}
            disabled={option.id === excludedId}
          >
            {option.title}
          </option>
        ))}
      </select>

      <p className="mt-6 text-sm text-secondary">{future.subtitle}</p>

      <h2 className="mt-2 text-2xl font-semibold text-white">
        {future.title}
      </h2>

      <p className="mt-4 text-sm leading-7 text-muted">
        {future.summary}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(future.tags || []).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

type BattleRowProps = {
  label: string;
  leftValue: number;
  rightValue: number;
  positive: boolean;
};

function BattleRow({
  label,
  leftValue,
  rightValue,
  positive,
}: BattleRowProps) {
  const leftWins = positive
    ? leftValue > rightValue
    : leftValue < rightValue;

  const rightWins = positive
    ? rightValue > leftValue
    : rightValue < leftValue;

  return (
    <div className="grid grid-cols-[1fr_0.75fr_1fr] items-center gap-3 px-5 py-6 sm:px-8">
      <ScoreSide value={leftValue} winner={leftWins} align="right" />

      <div className="text-center">
        <p className="text-sm font-medium text-slate-300">{label}</p>

        {!positive && (
          <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted">
            Lower is better
          </p>
        )}
      </div>

      <ScoreSide value={rightValue} winner={rightWins} align="left" />
    </div>
  );
}

type ScoreSideProps = {
  value: number;
  winner: boolean;
  align: "left" | "right";
};

function ScoreSide({ value, winner, align }: ScoreSideProps) {
  return (
    <div>
      <div
        className={`flex items-center gap-3 ${
          align === "right" ? "justify-end" : "justify-start"
        }`}
      >
        <span
          className={`text-2xl font-semibold ${
            winner ? "text-success" : "text-white"
          }`}
        >
          {value}
        </span>

        {winner && <Trophy size={17} className="text-warning" />}
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 ${
            align === "right" ? "ml-auto" : ""
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}