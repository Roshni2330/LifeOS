"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle, Sparkles } from "lucide-react";

const simulationSteps = [
  "Building your Decision DNA",
  "Analysing your goals and priorities",
  "Simulating three possible futures",
  "Calculating your Life Scores",
  "Connecting with your future self",
];

export default function SimulationPage() {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const simulation = localStorage.getItem("lifeos-simulation");

    if (!simulation) {
      router.push("/onboarding");
      return;
    }

    // Save AI response for dashboard
    localStorage.setItem("lifeos-dashboard", simulation);

    const stepInterval = window.setInterval(() => {
      setActiveStep((currentStep) => {
        if (currentStep >= simulationSteps.length - 1) {
          window.clearInterval(stepInterval);
          return currentStep;
        }

        return currentStep + 1;
      });
    }, 900);

    const progressInterval = window.setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 100) {
          window.clearInterval(progressInterval);
          return 100;
        }

        return Math.min(currentProgress + 3, 100);
      });
    }, 70);

    const redirectTimer = window.setTimeout(() => {
      router.push("/dashboard");
    }, 3500);

    return () => {
      window.clearInterval(stepInterval);
      window.clearInterval(progressInterval);
      window.clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute left-[15%] top-[20%] h-80 w-80 rounded-full bg-primary/20 blur-[130px]" />

      <div className="pointer-events-none absolute bottom-[15%] right-[15%] h-80 w-80 rounded-full bg-secondary/15 blur-[130px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)",
          backgroundSize: "55px 55px",
        }}
      />

      <section className="relative z-10 w-full max-w-3xl">
        <div className="glass-panel rounded-[36px] px-6 py-10 text-center sm:px-12 sm:py-14">
          <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/15" />

            <div className="absolute inset-3 animate-pulse rounded-full border border-secondary/30" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-secondary shadow-[0_0_60px_rgba(139,92,246,0.4)]">
              <Sparkles size={36} className="text-white" />
            </div>
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.3em] text-secondary">
            LifeOS Simulation Engine
          </p>

          <h1 className="text-gradient mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Creating your possible futures
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
            Your digital twin is analysing your goals, priorities and available
            paths.
          </p>

          <div className="mt-10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Simulation progress</span>

              <span className="font-semibold text-secondary">
                {progress}%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-primary-light to-secondary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-xl space-y-3 text-left">
            {simulationSteps.map((step, index) => {
              const isComplete = index < activeStep;
              const isActive = index === activeStep;

              return (
                <div
                  key={step}
                  className={`flex items-center gap-4 rounded-2xl border px-4 py-4 transition-all duration-500 ${
                    isActive
                      ? "border-secondary/40 bg-secondary/[0.08]"
                      : "border-white/[0.07] bg-white/[0.025]"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      isComplete
                        ? "bg-success/15 text-success"
                        : isActive
                        ? "bg-secondary/15 text-secondary"
                        : "bg-white/[0.05] text-muted"
                    }`}
                  >
                    {isComplete ? (
                      <Check size={18} />
                    ) : isActive ? (
                      <LoaderCircle size={18} className="animate-spin" />
                    ) : (
                      <span className="text-xs font-semibold">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-sm sm:text-base ${
                      isActive || isComplete
                        ? "text-white"
                        : "text-muted"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-xs text-muted">
            These scenarios are decision-support simulations, not guaranteed
            predictions.
          </p>
        </div>
      </section>
    </main>
  );
}