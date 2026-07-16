"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BrainCircuit,
  Dumbbell,
  FolderKanban,
  Network,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

type ScoreKey =
  | "career"
  | "finance"
  | "learning"
  | "wellbeing"
  | "stress"
  | "regret";

type ScoreSet = Record<ScoreKey, number>;

const baselineScores: ScoreSet = {
  career: 82,
  finance: 74,
  learning: 76,
  wellbeing: 68,
  stress: 61,
  regret: 34,
};

const scoreMeta = [
  { key: "career" as const, label: "Career growth", positive: true },
  { key: "finance" as const, label: "Financial stability", positive: true },
  { key: "learning" as const, label: "Learning", positive: true },
  { key: "wellbeing" as const, label: "Well-being", positive: true },
  { key: "stress" as const, label: "Stress", positive: false },
  { key: "regret" as const, label: "Regret risk", positive: false },
];

export default function ButterflyPage() {
  const [studyHours, setStudyHours] = useState(1);
  const [exerciseDays, setExerciseDays] = useState(2);
  const [projectsPerMonth, setProjectsPerMonth] = useState(1);
  const [networkingLevel, setNetworkingLevel] = useState(30);

  const updatedScores = useMemo(() => {
    const score: ScoreSet = { ...baselineScores };

    score.learning += studyHours * 4;
    score.career += studyHours * 2;

    score.wellbeing += exerciseDays * 3;
    score.stress -= exerciseDays * 2;

    score.learning += projectsPerMonth * 3;
    score.career += projectsPerMonth * 4;
    score.finance += projectsPerMonth * 2;

    score.career += Math.round(networkingLevel * 0.08);
    score.finance += Math.round(networkingLevel * 0.05);
    score.regret -= Math.round(networkingLevel * 0.04);

    if (studyHours >= 4) {
      score.stress += 6;
      score.wellbeing -= 4;
    }

    if (projectsPerMonth >= 3) {
      score.stress += 4;
    }

    Object.keys(score).forEach((key) => {
      const typedKey = key as ScoreKey;
      score[typedKey] = Math.max(0, Math.min(100, score[typedKey]));
    });

    return score;
  }, [studyHours, exerciseDays, projectsPerMonth, networkingLevel]);

  const strongestChange = useMemo(() => {
    let bestLabel = "";
    let bestDifference = -Infinity;

    scoreMeta.forEach((item) => {
      const before = baselineScores[item.key];
      const after = updatedScores[item.key];

      const effectiveDifference = item.positive
        ? after - before
        : before - after;

      if (effectiveDifference > bestDifference) {
        bestDifference = effectiveDifference;
        bestLabel = item.label;
      }
    });

    return {
      label: bestLabel,
      difference: bestDifference,
    };
  }, [updatedScores]);

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
            Butterfly Effect
          </p>

          <h1 className="text-gradient mx-auto mt-4 max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Change one habit. Watch your future evolve.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
            Adjust small daily choices and see how they influence your future
            career, learning, stress, well-being and regret.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <article className="glass-panel rounded-[32px] p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/20 text-secondary">
                <BrainCircuit size={23} />
              </div>

              <div>
                <p className="text-sm text-secondary">Change your inputs</p>
                <h2 className="text-2xl font-semibold text-white">
                  Small choices today
                </h2>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <HabitSlider
                icon={Sparkles}
                label="Focused study each day"
                value={studyHours}
                min={0}
                max={5}
                suffix=" hrs"
                lowLabel="No focused study"
                highLabel="5 hours daily"
                onChange={setStudyHours}
              />

              <HabitSlider
                icon={Dumbbell}
                label="Exercise each week"
                value={exerciseDays}
                min={0}
                max={7}
                suffix=" days"
                lowLabel="No exercise"
                highLabel="Daily exercise"
                onChange={setExerciseDays}
              />

              <HabitSlider
                icon={FolderKanban}
                label="Projects completed monthly"
                value={projectsPerMonth}
                min={0}
                max={4}
                suffix=""
                lowLabel="No projects"
                highLabel="4 projects"
                onChange={setProjectsPerMonth}
              />

              <HabitSlider
                icon={Network}
                label="Networking effort"
                value={networkingLevel}
                min={0}
                max={100}
                suffix="%"
                lowLabel="Minimal"
                highLabel="Highly active"
                onChange={setNetworkingLevel}
              />
            </div>
          </article>

          <article className="glass-panel rounded-[32px] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-sm text-secondary">Future recalculation</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  Before vs after
                </h2>
              </div>

              <div className="rounded-2xl border border-success/20 bg-success/[0.07] px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.16em] text-success">
                  Strongest improvement
                </p>
                <p className="mt-1 font-semibold text-white">
                  {strongestChange.label} +{strongestChange.difference}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {scoreMeta.map((item) => (
                <ScoreComparison
                  key={item.key}
                  label={item.label}
                  before={baselineScores[item.key]}
                  after={updatedScores[item.key]}
                  positive={item.positive}
                />
              ))}
            </div>
          </article>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <article className="glass-panel rounded-3xl p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              AI interpretation
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-white">
              How these habits reshape your future
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Increasing focused study and project output improves your
              long-term learning and career strength. Exercise helps reduce
              stress and improves well-being, while stronger networking creates
              more opportunities and lowers future regret.
            </p>

            <p className="mt-4 text-sm leading-7 text-muted">
              The simulator also adds trade-offs. Very high study or project
              intensity can increase stress, showing that more effort is not
              always automatically better.
            </p>
          </article>

          <article className="glass-panel rounded-3xl p-7">
            <p className="text-sm text-secondary">Updated future signal</p>

            <h2 className="mt-2 text-3xl font-semibold text-white">
              Your choices are creating a stronger future
            </h2>

            <div className="mt-7 rounded-2xl border border-secondary/15 bg-secondary/[0.05] p-5">
              <p className="text-sm leading-7 text-muted">
                With your current habit settings, your learning and career
                potential increase while regret risk drops. The most important
                next step is to make these habits sustainable.
              </p>
            </div>

            <Link
              href="/compare"
              className="mt-7 inline-flex rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-white"
            >
              Compare updated futures
            </Link>
          </article>
        </section>
      </div>
    </main>
  );
}

type HabitSliderProps = {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  lowLabel: string;
  highLabel: string;
  onChange: (value: number) => void;
};

function HabitSlider({
  icon: Icon,
  label,
  value,
  min,
  max,
  suffix,
  lowLabel,
  highLabel,
  onChange,
}: HabitSliderProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/15 text-secondary">
            <Icon size={20} />
          </div>

          <p className="font-semibold text-white">{label}</p>
        </div>

        <span className="rounded-xl bg-secondary/10 px-3 py-1.5 text-sm font-semibold text-secondary">
          {value}
          {suffix}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-5 w-full accent-cyan-400"
      />

      <div className="mt-2 flex justify-between text-xs text-muted">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

type ScoreComparisonProps = {
  label: string;
  before: number;
  after: number;
  positive: boolean;
};

function ScoreComparison({
  label,
  before,
  after,
  positive,
}: ScoreComparisonProps) {
  const rawDifference = after - before;
  const effectiveImprovement = positive ? rawDifference : -rawDifference;
  const improved = effectiveImprovement > 0;
  const unchanged = effectiveImprovement === 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-medium text-slate-300">{label}</p>

          {!positive && (
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
              Lower is better
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">{before}</span>

          <span className="text-muted">→</span>

          <span
            className={`text-xl font-semibold ${
              improved
                ? "text-success"
                : unchanged
                  ? "text-white"
                  : "text-danger"
            }`}
          >
            {after}
          </span>

          {!unchanged &&
            (improved ? (
              <TrendingUp size={18} className="text-success" />
            ) : (
              <TrendingDown size={18} className="text-danger" />
            ))}
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
          style={{ width: `${after}%` }}
        />
      </div>
    </div>
  );
}