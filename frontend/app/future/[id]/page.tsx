import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleDollarSign,
  HeartPulse,
  Home,
  MapPin,
  MessageCircleMore,
  Sparkles,
  Trophy,
  UserRound,
} from "lucide-react";

type FuturePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const futureData = {
  stable: {
    label: "Universe A",
    title: "Stable Career Future",
    year: "2035",
    role: "Senior Data Scientist",
    company: "Microsoft",
    location: "Bengaluru, India",
    age: "32",
    salary: "₹38 LPA",
    savings: "₹52 Lakhs",
    health: "82%",
    happiness: "86%",
    achievement: "Led a high-impact AI product used by millions.",
    regret:
      "You sometimes wonder whether taking a bigger risk earlier could have accelerated your growth.",
    summary:
      "This future gives you financial stability, structured growth and a strong professional identity. It requires patience and consistent skill-building.",
    advice:
      "Stop waiting to feel completely ready. The opportunities that changed our life appeared only after we started applying before feeling perfect.",
  },
  growth: {
    label: "Universe B",
    title: "High-Growth Future",
    year: "2035",
    role: "AI Product Lead",
    company: "Global AI Startup",
    location: "Singapore",
    age: "32",
    salary: "₹62 LPA",
    savings: "₹41 Lakhs",
    health: "67%",
    happiness: "88%",
    achievement: "Built and launched an AI platform across three countries.",
    regret:
      "The intense pace created periods of burnout and reduced time with family.",
    summary:
      "This future maximizes learning and career acceleration. It offers high upside, but requires stronger emotional resilience and risk tolerance.",
    advice:
      "Take the ambitious path, but protect your health from the beginning. Success was worth it only after we learned to create boundaries.",
  },
  studies: {
    label: "Universe C",
    title: "Higher Studies Future",
    year: "2035",
    role: "Machine Learning Research Scientist",
    company: "AI Research Lab",
    location: "London, UK",
    age: "32",
    salary: "₹46 LPA",
    savings: "₹34 Lakhs",
    health: "88%",
    happiness: "90%",
    achievement: "Published applied AI research and mentored young researchers.",
    regret:
      "Income growth started later, and the academic route demanded long-term patience.",
    summary:
      "This future gives you deep expertise, global exposure and meaningful research opportunities, while delaying immediate financial stability.",
    advice:
      "Choose depth only if you truly enjoy the learning process. The degree opened doors, but curiosity created the career.",
  },
};

const timeline = [
  {
    year: "2026",
    title: "Foundation year",
    description:
      "Strengthened programming, statistics and machine-learning fundamentals.",
  },
  {
    year: "2027",
    title: "First major opportunity",
    description:
      "Entered a role that provided real-world data and AI project experience.",
  },
  {
    year: "2029",
    title: "Career breakthrough",
    description:
      "Moved into a stronger product or research environment with higher responsibility.",
  },
  {
    year: "2032",
    title: "Leadership transition",
    description:
      "Started owning complex projects, mentoring others and influencing decisions.",
  },
  {
    year: "2035",
    title: "Future milestone",
    description:
      "Reached a mature career stage with stronger confidence, financial independence and clarity.",
  },
];

const scoreItems = [
  { label: "Career growth", value: 91 },
  { label: "Financial stability", value: 84 },
  { label: "Learning", value: 94 },
  { label: "Well-being", value: 78 },
  { label: "Relationships", value: 82 },
  { label: "Purpose", value: 88 },
];

export default async function FuturePage({ params }: FuturePageProps) {
  const { id } = await params;

  const future =
    futureData[id as keyof typeof futureData] ?? futureData.stable;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute left-[8%] top-[8%] h-80 w-80 rounded-full bg-primary/15 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-[8%] right-[8%] h-80 w-80 rounded-full bg-secondary/10 blur-[130px]" />

      <div className="page-container relative z-10">
        <header className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to futures
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

        <section className="grid gap-8 py-16 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary">
              {future.label} · Year {future.year}
            </p>

            <h1 className="text-gradient mt-5 max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl">
              Meet the version of you who chose this path
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              {future.summary}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`/future/${id}/chat`}
                className="group flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
              >
                <MessageCircleMore size={18} />
                Talk to Future Me
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/compare"
                className="flex h-12 items-center rounded-2xl border border-white/10 px-6 text-sm font-medium text-white transition hover:bg-white/[0.05]"
              >
                Compare this future
              </Link>
            </div>
          </div>

          <article className="glass-panel rounded-[32px] p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20">
                <UserRound size={30} className="text-white" />
              </div>

              <div>
                <p className="text-sm text-secondary">Your future profile</p>
                <h2 className="text-2xl font-semibold text-white">
                  {future.title}
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <ProfileItem
                icon={BriefcaseBusiness}
                label="Role"
                value={future.role}
              />

              <ProfileItem
                icon={Building2}
                label="Company"
                value={future.company}
              />

              <ProfileItem
                icon={MapPin}
                label="Location"
                value={future.location}
              />

              <ProfileItem
                icon={CalendarDays}
                label="Age"
                value={future.age}
              />

              <ProfileItem
                icon={CircleDollarSign}
                label="Income"
                value={future.salary}
              />

              <ProfileItem
                icon={Home}
                label="Savings"
                value={future.savings}
              />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <MiniScore
                icon={HeartPulse}
                label="Health"
                value={future.health}
              />

              <MiniScore
                icon={Sparkles}
                label="Happiness"
                value={future.happiness}
              />
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="glass-panel rounded-3xl p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success/10 text-success">
                <Trophy size={22} />
              </div>

              <div>
                <p className="text-sm text-secondary">
                  Biggest achievement
                </p>
                <h2 className="text-xl font-semibold text-white">
                  What this future unlocked
                </h2>
              </div>
            </div>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              {future.achievement}
            </p>
          </article>

          <article className="glass-panel rounded-3xl p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                <HeartPulse size={22} />
              </div>

              <div>
                <p className="text-sm text-secondary">Possible regret</p>
                <h2 className="text-xl font-semibold text-white">
                  What this path may cost
                </h2>
              </div>
            </div>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              {future.regret}
            </p>
          </article>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="glass-panel rounded-3xl p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
              Life Score
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-white">
              How this future performs
            </h2>

            <div className="mt-8 space-y-6">
              {scoreItems.map((item) => (
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
          </article>

          <article className="glass-panel rounded-3xl p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
              Future Timeline
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-white">
              The milestones that shaped this life
            </h2>

            <div className="relative mt-8 space-y-7">
              <div className="absolute bottom-4 left-[19px] top-4 w-px bg-gradient-to-b from-primary via-secondary to-transparent" />

              {timeline.map((item) => (
                <div key={item.year} className="relative flex gap-5">
                  <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-secondary/30 bg-surface text-xs font-semibold text-secondary">
                    {item.year.slice(2)}
                  </div>

                  <div className="pb-2">
                    <p className="text-sm font-semibold text-secondary">
                      {item.year}
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="glass-panel my-8 rounded-[32px] p-8 text-center sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary">
            A message from Future You
          </p>

          <blockquote className="mx-auto mt-6 max-w-3xl text-2xl font-medium leading-10 text-white sm:text-3xl">
            “{future.advice}”
          </blockquote>

          <Link
            href={`/future/${id}/chat`}
            className="group mx-auto mt-8 flex h-12 w-fit items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 text-sm font-semibold text-white"
          >
            Continue the conversation
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

type ProfileItemProps = {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  label: string;
  value: string;
};

function ProfileItem({
  icon: Icon,
  label,
  value,
}: ProfileItemProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <Icon size={18} className="text-secondary" />

      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

type MiniScoreProps = {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  label: string;
  value: string;
};

function MiniScore({
  icon: Icon,
  label,
  value,
}: MiniScoreProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-3">
        <Icon size={19} className="text-secondary" />
        <span className="text-sm text-muted">{label}</span>
      </div>

      <span className="text-lg font-semibold text-white">{value}</span>
    </div>
  );
}