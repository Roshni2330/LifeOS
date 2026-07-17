"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  BrainCircuit,
  Dumbbell,
  FolderKanban,
  LoaderCircle,
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

type Future = {
  id: string;
  title: string;
  subtitle?: string;
  score?: number;
  summary: string;
  tags?: string[];
};

type Simulation = {
  futures?: Future[];
  lifeScores?: {
    career?: number;
    finance?: number;
    learning?: number;
    health?: number;
    stress?: number;
  };
};

type StoredSimulation = {
  success?: boolean;
  simulation?: Simulation;
};

type ButterflyApiResult = {
  career: number;
  finance: number;
  learning: number;
  health: number;
  stress: number;
  summary: string;
};

const API_BASE_URL = "http://localhost:5000";

const defaultBaselineScores: ScoreSet = {
  career: 82,
  finance: 74,
  learning: 76,
  wellbeing: 68,
  stress: 61,
  regret: 34,
};

const scoreMeta = [
  {
    key: "career" as const,
    label: "Career growth",
    positive: true,
  },
  {
    key: "finance" as const,
    label: "Financial stability",
    positive: true,
  },
  {
    key: "learning" as const,
    label: "Learning",
    positive: true,
  },
  {
    key: "wellbeing" as const,
    label: "Well-being",
    positive: true,
  },
  {
    key: "stress" as const,
    label: "Stress",
    positive: false,
  },
  {
    key: "regret" as const,
    label: "Regret risk",
    positive: false,
  },
];

function clampScore(value: unknown, fallback = 0) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return fallback;
  }

  return Math.max(0, Math.min(100, Math.round(numberValue)));
}

export default function ButterflyPage() {
  const [studyHours, setStudyHours] = useState(1);
  const [exerciseDays, setExerciseDays] = useState(2);
  const [projectsPerMonth, setProjectsPerMonth] = useState(1);
  const [networkingLevel, setNetworkingLevel] = useState(30);

  const [selectedFuture, setSelectedFuture] =
    useState<Future | null>(null);

  const [baselineScores, setBaselineScores] =
    useState<ScoreSet>(defaultBaselineScores);

  const [updatedScores, setUpdatedScores] =
    useState<ScoreSet>(defaultBaselineScores);

  const [summary, setSummary] = useState(
    "Move the sliders to see how small habit changes can reshape your future.",
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      const storedValue =
        localStorage.getItem("lifeos-dashboard") ||
        localStorage.getItem("lifeos-simulation");

      if (!storedValue) {
        setErrorMessage(
          "No simulation was found. Please generate your futures first.",
        );
        return;
      }

      const parsed = JSON.parse(storedValue) as
        | StoredSimulation
        | Simulation;

      const simulation =
        "simulation" in parsed && parsed.simulation
          ? parsed.simulation
          : (parsed as Simulation);

      const future =
        simulation.futures?.find(
          (item) => item.id === "growth",
        ) ||
        simulation.futures?.[0] ||
        null;

      if (!future) {
        setErrorMessage(
          "No future data was found. Please create a new simulation.",
        );
        return;
      }

      setSelectedFuture(future);

      const lifeScores = simulation.lifeScores;

      const generatedBaseline: ScoreSet = {
        career: clampScore(
          lifeScores?.career,
          defaultBaselineScores.career,
        ),
        finance: clampScore(
          lifeScores?.finance,
          defaultBaselineScores.finance,
        ),
        learning: clampScore(
          lifeScores?.learning,
          defaultBaselineScores.learning,
        ),
        wellbeing: clampScore(
          lifeScores?.health,
          defaultBaselineScores.wellbeing,
        ),
        stress: clampScore(
          lifeScores?.stress,
          defaultBaselineScores.stress,
        ),
        regret: Math.max(
          0,
          Math.min(
            100,
            100 -
              clampScore(
                future.score,
                100 - defaultBaselineScores.regret,
              ),
          ),
        ),
      };

      setBaselineScores(generatedBaseline);
      setUpdatedScores(generatedBaseline);
    } catch (error) {
      console.error("Failed to load LifeOS simulation:", error);
      setErrorMessage(
        "The saved simulation data could not be read.",
      );
    }
  }, []);

  useEffect(() => {
    if (!selectedFuture) {
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/butterfly/recalculate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            signal: controller.signal,
            body: JSON.stringify({
              future: selectedFuture,
              studyHours,
              sleepHours: 7,
              exercise: exerciseDays,
              networking: Math.round(
                networkingLevel / 20,
              ),
              projects: projectsPerMonth,
            }),
          },
        );

        const data = (await response.json()) as {
          success?: boolean;
          result?: ButterflyApiResult;
          message?: string;
        };

        if (!response.ok || !data.success || !data.result) {
          throw new Error(
            data.message ||
              "The Butterfly Effect could not be calculated.",
          );
        }

        const result = data.result;

        setUpdatedScores({
          career: clampScore(
            result.career,
            baselineScores.career,
          ),
          finance: clampScore(
            result.finance,
            baselineScores.finance,
          ),
          learning: clampScore(
            result.learning,
            baselineScores.learning,
          ),
          wellbeing: clampScore(
            result.health,
            baselineScores.wellbeing,
          ),
          stress: clampScore(
            result.stress,
            baselineScores.stress,
          ),
          regret: Math.max(
            0,
            Math.min(
              100,
              100 -
                Math.round(
                  (clampScore(result.career) +
                    clampScore(result.finance) +
                    clampScore(result.learning)) /
                    3,
                ),
            ),
          ),
        });

        setSummary(
          result.summary ||
            "Your habit changes created a new future signal.",
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Butterfly Effect recalculation failed:",
          error,
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to recalculate this future.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 650);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [
    selectedFuture,
    studyHours,
    exerciseDays,
    projectsPerMonth,
    networkingLevel,
    baselineScores.career,
    baselineScores.finance,
    baselineScores.learning,
    baselineScores.stress,
    baselineScores.wellbeing,
  ]);

  const strongestChange = useMemo(() => {
    let bestLabel = "No major change";
    let bestDifference = 0;

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
  }, [baselineScores, updatedScores]);

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
            AI Butterfly Effect
          </p>

          <h1 className="text-gradient mx-auto mt-4 max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Change one habit. Watch your future evolve.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
            Adjust small daily choices and let LifeOS AI recalculate
            your future career, learning, stress, well-being and regret.
          </p>
        </section>

        {selectedFuture && (
          <section className="glass-panel mb-6 rounded-3xl p-5">
            <p className="text-sm text-secondary">
              Future being recalculated
            </p>

            <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {selectedFuture.title}
                </h2>

                <p className="mt-1 text-sm text-muted">
                  {selectedFuture.summary}
                </p>
              </div>

              <span className="w-fit rounded-xl bg-success/10 px-3 py-1.5 text-sm font-semibold text-success">
                Original score {selectedFuture.score ?? 0}%
              </span>
            </div>
          </section>
        )}

        <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <article className="glass-panel rounded-[32px] p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/20 text-secondary">
                <BrainCircuit size={23} />
              </div>

              <div>
                <p className="text-sm text-secondary">
                  Change your inputs
                </p>

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
                max={6}
                suffix=" hrs"
                lowLabel="No focused study"
                highLabel="6 hours daily"
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

            {errorMessage && (
              <div className="mt-6 rounded-2xl border border-danger/20 bg-danger/[0.06] p-4 text-sm leading-6 text-danger">
                {errorMessage}
              </div>
            )}
          </article>

          <article className="glass-panel rounded-[32px] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-sm text-secondary">
                  AI future recalculation
                </p>

                <h2 className="mt-1 text-2xl font-semibold text-white">
                  Before vs after
                </h2>
              </div>

              <div className="rounded-2xl border border-success/20 bg-success/[0.07] px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.16em] text-success">
                  Strongest improvement
                </p>

                <p className="mt-1 font-semibold text-white">
                  {isLoading
                    ? "Recalculating..."
                    : `${strongestChange.label} +${strongestChange.difference}`}
                </p>
              </div>
            </div>

            {isLoading && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-secondary/20 bg-secondary/[0.06] p-4 text-sm text-slate-300">
                <LoaderCircle
                  size={18}
                  className="animate-spin text-secondary"
                />
                LifeOS AI is recalculating this future...
              </div>
            )}

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
              {summary}
            </p>

            <p className="mt-4 text-sm leading-7 text-muted">
              This is a simulated decision-support scenario. It shows
              possible trade-offs rather than guaranteeing an outcome.
            </p>
          </article>

          <article className="glass-panel rounded-3xl p-7">
            <p className="text-sm text-secondary">
              Updated future signal
            </p>

            <h2 className="mt-2 text-3xl font-semibold text-white">
              Small choices can create a different trajectory
            </h2>

            <div className="mt-7 rounded-2xl border border-secondary/15 bg-secondary/[0.05] p-5">
              <p className="text-sm leading-7 text-muted">
                Keep the settings realistic and sustainable. The most
                useful future is not always the one with maximum effort,
                but the one you can maintain consistently.
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
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
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
  const effectiveImprovement = positive
    ? rawDifference
    : -rawDifference;

  const improved = effectiveImprovement > 0;
  const unchanged = effectiveImprovement === 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-medium text-slate-300">
            {label}
          </p>

          {!positive && (
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
              Lower is better
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">
            {before}
          </span>

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
              <TrendingUp
                size={18}
                className="text-success"
              />
            ) : (
              <TrendingDown
                size={18}
                className="text-danger"
              />
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