"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Sparkles,
  Target,
} from "lucide-react";

type FormData = {
  name: string;
  age: string;
  currentRole: string;
  mainGoal: string;
  decision: string;
  optionOne: string;
  optionTwo: string;
  optionThree: string;
  riskTolerance: number;
  financialPriority: number;
  workLifePriority: number;
  learningPriority: number;
};

const initialFormData: FormData = {
  name: "",
  age: "",
  currentRole: "",
  mainGoal: "",
  decision: "",
  optionOne: "",
  optionTwo: "",
  optionThree: "",
  riskTolerance: 50,
  financialPriority: 50,
  workLifePriority: 50,
  learningPriority: 50,
};

const steps = [
  {
    title: "Let’s build your digital twin",
    description:
      "We’ll ask a few short questions to understand your goals, priorities and current decision.",
  },
  {
    title: "Tell us about yourself",
    description:
      "This helps LifeOS create future scenarios relevant to your current stage.",
  },
  {
    title: "What future are you working toward?",
    description:
      "Tell us about your main goal and the decision currently standing in your way.",
  },
  {
    title: "What options are you considering?",
    description:
      "Add three possible paths so LifeOS can compare different versions of your future.",
  },
  {
    title: "What matters most to you?",
    description:
      "Your priorities determine how every possible future will be evaluated.",
  },
  {
    title: "Ready to explore your futures?",
    description:
      "Review your answers before generating your Decision DNA and three possible futures.",
  },
];

const inputClassName =
  "mt-2 h-13 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-secondary/60 focus:bg-white/[0.06]";

const textareaClassName =
  "mt-2 min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-secondary/60 focus:bg-white/[0.06]";

export default function OnboardingPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const progress = ((currentStep + 1) / steps.length) * 100;

  function updateField<Key extends keyof FormData>(
    field: Key,
    value: FormData[Key],
  ) {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));
  }

  function nextStep() {
    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    localStorage.setItem(
      "lifeos-onboarding",
      JSON.stringify(formData),
    );

    router.push("/simulation");
  }

  function previousStep() {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function renderStepContent() {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Understand yourself",
                text: "Build your personalized Decision DNA.",
              },
              {
                icon: Sparkles,
                title: "Explore futures",
                text: "Generate three possible life paths.",
              },
              {
                icon: BriefcaseBusiness,
                title: "Choose clearly",
                text: "Compare growth, money, stress and purpose.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/20 text-secondary">
                    <Icon size={21} />
                  </div>

                  <h2 className="mt-5 font-semibold text-white">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        );

      case 1:
        return (
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="text-sm text-slate-300">
              Your name

              <input
                type="text"
                value={formData.name}
                onChange={(event) =>
                  updateField("name", event.target.value)
                }
                placeholder="Enter your name"
                className={inputClassName}
              />
            </label>

            <label className="text-sm text-slate-300">
              Your age

              <input
                type="number"
                min="14"
                max="100"
                value={formData.age}
                onChange={(event) =>
                  updateField("age", event.target.value)
                }
                placeholder="For example, 22"
                className={inputClassName}
              />
            </label>

            <label className="text-sm text-slate-300 sm:col-span-2">
              Current education or profession

              <div className="relative">
                <GraduationCap
                  size={18}
                  className="absolute left-4 top-[26px] text-muted"
                />

                <input
                  type="text"
                  value={formData.currentRole}
                  onChange={(event) =>
                    updateField(
                      "currentRole",
                      event.target.value,
                    )
                  }
                  placeholder="For example, final-year computer science student"
                  className={`${inputClassName} pl-12`}
                />
              </div>
            </label>
          </div>
        );

      case 2:
        return (
          <div className="grid gap-6">
            <label className="text-sm text-slate-300">
              What is your biggest goal?

              <textarea
                value={formData.mainGoal}
                onChange={(event) =>
                  updateField(
                    "mainGoal",
                    event.target.value,
                  )
                }
                placeholder="For example, I want to become a data scientist at a top technology company."
                className={textareaClassName}
              />
            </label>

            <label className="text-sm text-slate-300">
              What important decision are you facing?

              <textarea
                value={formData.decision}
                onChange={(event) =>
                  updateField(
                    "decision",
                    event.target.value,
                  )
                }
                placeholder="For example, should I accept a job, prepare for a better role or pursue higher studies?"
                className={textareaClassName}
              />
            </label>
          </div>
        );

      case 3:
        return (
          <div className="grid gap-5">
            {[
              {
                label: "Option A",
                field: "optionOne" as const,
                placeholder:
                  "For example, accept the corporate job",
              },
              {
                label: "Option B",
                field: "optionTwo" as const,
                placeholder:
                  "For example, prepare for a product company",
              },
              {
                label: "Option C",
                field: "optionThree" as const,
                placeholder:
                  "For example, pursue higher studies",
              },
            ].map((option) => (
              <label
                key={option.field}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-sm text-slate-300"
              >
                <span className="font-semibold text-secondary">
                  {option.label}
                </span>

                <input
                  type="text"
                  value={formData[option.field]}
                  onChange={(event) =>
                    updateField(
                      option.field,
                      event.target.value,
                    )
                  }
                  placeholder={option.placeholder}
                  className={inputClassName}
                />
              </label>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="grid gap-5">
            <PrioritySlider
              label="Risk tolerance"
              lowLabel="Prefer safety"
              highLabel="Comfortable with risk"
              value={formData.riskTolerance}
              onChange={(value) =>
                updateField("riskTolerance", value)
              }
            />

            <PrioritySlider
              label="Financial stability"
              lowLabel="Less important"
              highLabel="Extremely important"
              value={formData.financialPriority}
              onChange={(value) =>
                updateField("financialPriority", value)
              }
            />

            <PrioritySlider
              label="Work-life balance"
              lowLabel="Career comes first"
              highLabel="Balance is essential"
              value={formData.workLifePriority}
              onChange={(value) =>
                updateField("workLifePriority", value)
              }
            />

            <PrioritySlider
              label="Learning and growth"
              lowLabel="Steady learning"
              highLabel="Maximum growth"
              value={formData.learningPriority}
              onChange={(value) =>
                updateField("learningPriority", value)
              }
            />
          </div>
        );

      case 5:
        return (
          <div className="grid gap-5 sm:grid-cols-2">
            <ReviewCard
              label="Your profile"
              value={`${formData.name || "Not provided"}, ${
                formData.age || "age not provided"
              }`}
            />

            <ReviewCard
              label="Current role"
              value={formData.currentRole || "Not provided"}
            />

            <ReviewCard
              label="Main goal"
              value={formData.mainGoal || "Not provided"}
            />

            <ReviewCard
              label="Current decision"
              value={formData.decision || "Not provided"}
            />

            <ReviewCard
              label="Option A"
              value={formData.optionOne || "Not provided"}
            />

            <ReviewCard
              label="Option B"
              value={formData.optionTwo || "Not provided"}
            />

            <ReviewCard
              label="Option C"
              value={formData.optionThree || "Not provided"}
            />

            <ReviewCard
              label="Top priorities"
              value={`Finance ${formData.financialPriority}% · Balance ${formData.workLifePriority}% · Growth ${formData.learningPriority}%`}
            />
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute left-[10%] top-[10%] h-72 w-72 rounded-full bg-primary/15 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-[10%] right-[10%] h-72 w-72 rounded-full bg-secondary/10 blur-[120px]" />

      <div className="page-container relative z-10">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Sparkles
                size={19}
                className="text-white"
              />
            </span>

            <span className="text-lg font-semibold text-white">
              LifeOS{" "}
              <span className="text-secondary">
                AI
              </span>
            </span>
          </Link>

          <p className="text-sm text-muted">
            Step {currentStep + 1} of {steps.length}
          </p>
        </header>

        <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <section className="mx-auto flex min-h-[calc(100vh-150px)] max-w-4xl items-center justify-center py-12">
          <div className="glass-panel w-full rounded-[32px] p-7 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-secondary">
              Digital Twin Setup
            </p>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {steps[currentStep].title}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              {steps[currentStep].description}
            </p>

            <div className="mt-10">
              {renderStepContent()}
            </div>

            <div className="mt-10 flex items-center justify-between">
              <button
                type="button"
                onClick={previousStep}
                disabled={currentStep === 0}
                className="flex h-12 items-center gap-2 rounded-2xl border border-border px-5 text-sm font-medium text-white transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowLeft size={17} />
                Back
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="group flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
              >
                {currentStep === steps.length - 1
                  ? "Generate my futures"
                  : "Continue"}

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

type PrioritySliderProps = {
  label: string;
  lowLabel: string;
  highLabel: string;
  value: number;
  onChange: (value: number) => void;
};

function PrioritySlider({
  label,
  lowLabel,
  highLabel,
  value,
  onChange,
}: PrioritySliderProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-white">
          {label}
        </p>

        <span className="rounded-lg bg-secondary/10 px-3 py-1 text-sm font-semibold text-secondary">
          {value}%
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
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

type ReviewCardProps = {
  label: string;
  value: string;
};

function ReviewCard({
  label,
  value,
}: ReviewCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
        {label}
      </p>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        {value}
      </p>
    </div>
  );
}