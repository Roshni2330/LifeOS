"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  GitCompareArrows,
  Sparkles,
  Trophy,
} from "lucide-react";

type FutureId = "stable" | "growth" | "studies";

type FutureOption = {
  id: FutureId;
  name: string;
  subtitle: string;
  summary: string;
  scores: {
    career: number;
    finance: number;
    learning: number;
    wellbeing: number;
    relationships: number;
    stress: number;
    regret: number;
  };
};

const futureOptions: FutureOption[] = [
  {
    id: "stable",
    name: "Stable Career Path",
    subtitle: "Job-first future",
    summary:
      "Immediate income, structured growth and lower short-term uncertainty.",
    scores: {
      career: 82,
      finance: 91,
      learning: 72,
      wellbeing: 80,
      relationships: 84,
      stress: 48,
      regret: 31,
    },
  },
  {
    id: "growth",
    name: "High-Growth Path",
    subtitle: "Focused preparation",
    summary:
      "Maximum career acceleration and learning with greater pressure and risk.",
    scores: {
      career: 94,
      finance: 83,
      learning: 96,
      wellbeing: 64,
      relationships: 69,
      stress: 79,
      regret: 27,
    },
  },
  {
    id: "studies",
    name: "Higher Studies Path",
    subtitle: "Deep expertise",
    summary:
      "Delayed income, stronger specialization and better long-term research access.",
    scores: {
      career: 87,
      finance: 68,
      learning: 98,
      wellbeing: 86,
      relationships: 82,
      stress: 55,
      regret: 22,
    },
  },
];

const scoreLabels = [
  { key: "career", label: "Career growth", positive: true },
  { key: "finance", label: "Financial stability", positive: true },
  { key: "learning", label: "Learning", positive: true },
  { key: "wellbeing", label: "Well-being", positive: true },
  { key: "relationships", label: "Relationships", positive: true },
  { key: "stress", label: "Stress", positive: false },
  { key: "regret", label: "Regret risk", positive: false },
] as const;

export default function ComparePage() {
  const [leftId, setLeftId] = useState<FutureId>("stable");
  const [rightId, setRightId] = useState<FutureId>("growth");

  const leftFuture =
    futureOptions.find((future) => future.id === leftId) ?? futureOptions[0];

  const rightFuture =
    futureOptions.find((future) => future.id === rightId) ?? futureOptions[1];

  const comparison = useMemo(() => {
    let leftPoints = 0;
    let rightPoints = 0;

    scoreLabels.forEach((item) => {
      const leftValue = leftFuture.scores[item.key];
      const rightValue = rightFuture.scores[item.key];

      if (leftValue === rightValue) return;

      if (item.positive) {
        if (leftValue > rightValue) leftPoints += 1;
        else rightPoints += 1;
      } else {
        if (leftValue < rightValue) leftPoints += 1;
        else rightPoints += 1;
      }
    });

    const winner =
      leftPoints === rightPoints
        ? null
        : leftPoints > rightPoints
          ? leftFuture
          : rightFuture;

    const confidence =
      leftPoints === rightPoints
        ? 50
        : Math.round(
            60 +
              (Math.abs(leftPoints - rightPoints) / scoreLabels.length) * 35,
          );

    return {
      leftPoints,
      rightPoints,
      winner,
      confidence,
    };
  }, [leftFuture, rightFuture]);

  const winnerReason = getWinnerReason(
    comparison.winner,
    leftFuture,
    rightFuture,
  );

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
            Decision Battle
          </p>

          <h1 className="text-gradient mx-auto mt-4 max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Compare two versions of your future
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
            See which future better matches your priorities across growth,
            money, learning, well-being and regret.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <FutureSelector
            label="Future A"
            selectedId={leftId}
            onChange={setLeftId}
            future={leftFuture}
            excludedId={rightId}
          />

          <div className="flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-secondary/20 bg-secondary/[0.08] text-secondary">
              <GitCompareArrows size={25} />
            </div>
          </div>

          <FutureSelector
            label="Future B"
            selectedId={rightId}
            onChange={setRightId}
            future={rightFuture}
            excludedId={leftId}
          />
        </section>

        <section className="glass-panel mt-8 overflow-hidden rounded-[32px]">
          <div className="grid grid-cols-[1fr_0.75fr_1fr] border-b border-white/10 px-5 py-5 text-center sm:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                Future A
              </p>
              <h2 className="mt-2 font-semibold text-white">
                {leftFuture.name}
              </h2>
            </div>

            <div className="self-center text-sm text-muted">Comparison</div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                Future B
              </p>
              <h2 className="mt-2 font-semibold text-white">
                {rightFuture.name}
              </h2>
            </div>
          </div>

          <div className="divide-y divide-white/[0.07]">
            {scoreLabels.map((item) => (
              <BattleRow
                key={item.key}
                label={item.label}
                leftValue={leftFuture.scores[item.key]}
                rightValue={rightFuture.scores[item.key]}
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
                  {comparison.winner?.name ?? "Balanced result"}
                </h2>
              </div>
            </div>

            <div className="mt-7 flex items-end justify-between">
              <div>
                <p className="text-sm text-muted">Recommendation confidence</p>

                <p className="mt-2 text-5xl font-semibold text-white">
                  {comparison.confidence}%
                </p>
              </div>

              <div className="rounded-2xl bg-success/10 px-4 py-3 text-center text-success">
                <CheckCircle2 size={24} className="mx-auto" />
                <p className="mt-1 text-xs font-semibold">
                  {comparison.leftPoints}–{comparison.rightPoints}
                </p>
              </div>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                style={{ width: `${comparison.confidence}%` }}
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
              {winnerReason}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={
                  comparison.winner
                    ? `/future/${comparison.winner.id}`
                    : "/dashboard"
                }
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
  selectedId: FutureId;
  onChange: (value: FutureId) => void;
  future: FutureOption;
  excludedId: FutureId;
};

function FutureSelector({
  label,
  selectedId,
  onChange,
  future,
  excludedId,
}: FutureSelectorProps) {
  return (
    <article className="glass-panel rounded-3xl p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
        {label}
      </p>

      <select
        value={selectedId}
        onChange={(event) => onChange(event.target.value as FutureId)}
        className="mt-4 h-12 w-full rounded-2xl border border-white/10 bg-surface-soft px-4 text-sm text-white outline-none focus:border-secondary/40"
      >
        {futureOptions.map((option) => (
          <option
            key={option.id}
            value={option.id}
            disabled={option.id === excludedId}
          >
            {option.name}
          </option>
        ))}
      </select>

      <p className="mt-6 text-sm text-secondary">{future.subtitle}</p>

      <h2 className="mt-2 text-2xl font-semibold text-white">
        {future.name}
      </h2>

      <p className="mt-4 text-sm leading-7 text-muted">{future.summary}</p>
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
          className={`h-full rounded-full bg-gradient-to-r from-primary to-secondary ${
            align === "right" ? "ml-auto" : ""
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function getWinnerReason(
  winner: FutureOption | null,
  leftFuture: FutureOption,
  rightFuture: FutureOption,
) {
  if (!winner) {
    return `${leftFuture.name} and ${rightFuture.name} are closely balanced. The better choice depends on whether you currently value immediate stability or long-term exploration more strongly.`;
  }

  if (winner.id === "stable") {
    return `${winner.name} performs better when immediate income, lower stress and relationship stability matter most. It offers fewer short-term disruptions while still providing steady professional growth.`;
  }

  if (winner.id === "growth") {
    return `${winner.name} is the stronger match for a profile that prioritizes ambitious career growth and maximum learning. The advantage comes with higher stress, so this path works best when supported by clear boundaries and resilience.`;
  }

  return `${winner.name} fits a profile that values deep learning, well-being and lower long-term regret. Although financial progress begins more slowly, the path offers stronger specialization and meaningful long-term work.`;
}