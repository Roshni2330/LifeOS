"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  Bot,
  LoaderCircle,
  MessageCircleMore,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type Message = {
  id: number;
  role: "user" | "future";
  text: string;
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
  decisionDNA?: Record<string, number>;
  lifeScores?: Record<string, number>;
  recommendation?: string;
  timeline?: string[];
  futures?: Future[];
};

type StoredSimulation = {
  success?: boolean;
  simulation?: Simulation;
};

type UserProfile = {
  name?: string;
  age?: string | number;
  currentRole?: string;
  mainGoal?: string;
  decision?: string;
  optionOne?: string;
  optionTwo?: string;
  optionThree?: string;
  riskTolerance?: number;
  financialPriority?: number;
  workLifePriority?: number;
  learningPriority?: number;
};

const fallbackProfiles = {
  stable: {
    title: "Stable Career Future",
    subtitle: "You in 2035",
    intro:
      "I chose stability first. It gave me financial security, confidence and a strong career foundation.",
    starterQuestions: [
      "What was the hardest part of this path?",
      "What do you regret?",
      "What should I start doing today?",
      "Did this decision make you happy?",
    ],
  },
  growth: {
    title: "High-Growth Future",
    subtitle: "You in 2035",
    intro:
      "I chose the ambitious route. It accelerated my learning and career, but I had to learn how to protect my energy.",
    starterQuestions: [
      "Was taking the risk worth it?",
      "What caused the most stress?",
      "What should I avoid?",
      "How did you reach this role?",
    ],
  },
  studies: {
    title: "Higher Studies Future",
    subtitle: "You in 2035",
    intro:
      "I chose depth, specialization and research. The rewards came later, but the work became deeply meaningful.",
    starterQuestions: [
      "Was delaying income worth it?",
      "How difficult was the academic path?",
      "Would you choose it again?",
      "What should I prepare before applying?",
    ],
  },
};

export default function FutureChatPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const futureId = params.id ?? "stable";

  const [future, setFuture] = useState<Future | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [pageError, setPageError] = useState("");
  const [chatError, setChatError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const fallbackProfile =
    fallbackProfiles[futureId as keyof typeof fallbackProfiles] ??
    fallbackProfiles.stable;

  const starterQuestions = useMemo(() => {
    if (futureId === "stable") {
      return fallbackProfiles.stable.starterQuestions;
    }

    if (futureId === "studies") {
      return fallbackProfiles.studies.starterQuestions;
    }

    return fallbackProfiles.growth.starterQuestions;
  }, [futureId]);

  useEffect(() => {
    try {
      const storedSimulation =
        localStorage.getItem("lifeos-dashboard") ||
        localStorage.getItem("lifeos-simulation");

      if (!storedSimulation) {
        setPageError("No simulation data was found.");
        setIsLoadingPage(false);
        return;
      }

      const parsed = JSON.parse(storedSimulation) as
        | StoredSimulation
        | Simulation;

      const simulation =
        "simulation" in parsed && parsed.simulation
          ? parsed.simulation
          : (parsed as Simulation);

      const selectedFuture = simulation.futures?.find(
        (item) => item.id === futureId,
      );

      if (!selectedFuture) {
        setPageError("The selected future could not be found.");
        setIsLoadingPage(false);
        return;
      }

      const storedProfile = localStorage.getItem("lifeos-onboarding");

      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile) as UserProfile);
      }

      setFuture(selectedFuture);

      setMessages([
        {
          id: 1,
          role: "future",
          text: `Hi. I’m the version of you who chose the ${selectedFuture.title.toLowerCase()}. ${selectedFuture.summary}`,
        },
      ]);
    } catch (error) {
      console.error("Failed to load future chat data:", error);

      setPageError(
        error instanceof Error
          ? error.message
          : "Failed to load this future.",
      );
    } finally {
      setIsLoadingPage(false);
    }
  }, [futureId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isSending]);

  const nextId = useMemo(() => messages.length + 1, [messages.length]);

  async function sendQuestion(question: string) {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || !future || isSending) {
      return;
    }

    const userMessage: Message = {
      id: nextId,
      role: "user",
      text: trimmedQuestion,
    };

    const previousMessages = messages;

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);

    setInput("");
    setChatError("");
    setIsSending(true);

    try {
      const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: trimmedQuestion,
            future,
            userProfile: {
              name: userProfile.name,
              age: userProfile.age,
              currentRole: userProfile.currentRole,
              goal: userProfile.mainGoal,
              decision: userProfile.decision,
              priorities: {
                riskTolerance: userProfile.riskTolerance,
                financialPriority:
                  userProfile.financialPriority,
                workLifePriority:
                  userProfile.workLifePriority,
                learningPriority:
                  userProfile.learningPriority,
              },
            },
            conversation: previousMessages,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success || !data.reply) {
        throw new Error(
          data.message || "Future You could not reply.",
        );
      }

      const futureMessage: Message = {
        id: nextId + 1,
        role: "future",
        text: data.reply,
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        futureMessage,
      ]);
    } catch (error) {
      console.error("Future chat request failed:", error);

      setChatError(
        error instanceof Error
          ? error.message
          : "Unable to reach Future You.",
      );
    } finally {
      setIsSending(false);
    }
  }

  async function submitMessage(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    await sendQuestion(input);
  }

  if (isLoadingPage) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <section className="glass-panel max-w-xl rounded-[32px] p-10 text-center">
          <LoaderCircle
            size={40}
            className="mx-auto animate-spin text-secondary"
          />

          <h1 className="text-gradient mt-6 text-4xl font-semibold">
            Connecting to Future You
          </h1>

          <p className="mt-4 text-muted">
            Loading the selected AI-generated future.
          </p>
        </section>
      </main>
    );
  }

  if (!future || pageError) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <section className="glass-panel max-w-xl rounded-[32px] p-10 text-center">
          <Bot size={40} className="mx-auto text-secondary" />

          <h1 className="text-gradient mt-6 text-4xl font-semibold">
            Future unavailable
          </h1>

          <p className="mt-4 text-muted">
            {pageError || "Please generate a simulation first."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mt-7 rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white"
          >
            Back to dashboard
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6">
      <div className="pointer-events-none absolute left-[10%] top-[12%] h-80 w-80 rounded-full bg-primary/15 blur-[130px]" />

      <div className="pointer-events-none absolute bottom-[8%] right-[10%] h-80 w-80 rounded-full bg-secondary/10 blur-[130px]" />

      <div className="page-container relative z-10">
        <header className="flex items-center justify-between">
          <Link
            href={`/future/${futureId}`}
            className="flex items-center gap-2 text-sm text-muted transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to future
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

        <section className="mx-auto max-w-5xl py-10">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary">
              AI Future Self Conversation
            </p>

            <h1 className="text-gradient mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Talk to the version of you who lived this path
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted">
              Ask about regrets, difficult moments, happiness and
              what you should begin doing today.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
            <aside className="glass-panel h-fit rounded-3xl p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20">
                <UserRound size={30} className="text-white" />
              </div>

              <p className="mt-6 text-sm text-secondary">
                {fallbackProfile.subtitle}
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-white">
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

              <div className="mt-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                  Suggested questions
                </p>

                <div className="mt-4 space-y-3">
                  {starterQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      disabled={isSending}
                      onClick={() => sendQuestion(question)}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm leading-6 text-slate-300 transition hover:border-secondary/30 hover:bg-secondary/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <section className="glass-panel flex min-h-[640px] flex-col overflow-hidden rounded-3xl">
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                  <MessageCircleMore size={22} />
                </div>

                <div>
                  <h2 className="font-semibold text-white">
                    Future You
                  </h2>

                  <p className="text-xs text-success">
                    Connected through LifeOS AI
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm leading-7 sm:max-w-[72%] ${
                        message.role === "user"
                          ? "rounded-br-md bg-gradient-to-r from-primary to-secondary text-white"
                          : "rounded-bl-md border border-white/10 bg-white/[0.04] text-slate-200"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] opacity-75">
                        {message.role === "user" ? (
                          <>
                            <UserRound size={14} />
                            Present You
                          </>
                        ) : (
                          <>
                            <Bot size={14} />
                            Future You
                          </>
                        )}
                      </div>

                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}

                {isSending && (
                  <div className="flex justify-start">
                    <div className="rounded-3xl rounded-bl-md border border-white/10 bg-white/[0.04] px-5 py-4">
                      <div className="flex items-center gap-3 text-sm text-slate-300">
                        <LoaderCircle
                          size={17}
                          className="animate-spin text-secondary"
                        />
                        Future You is reflecting...
                      </div>
                    </div>
                  </div>
                )}

                {chatError && (
                  <div className="rounded-2xl border border-danger/20 bg-danger/[0.06] px-4 py-3 text-sm text-danger">
                    {chatError}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={submitMessage}
                className="border-t border-white/10 p-4 sm:p-5"
              >
                <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2 focus-within:border-secondary/40">
                  <textarea
                    value={input}
                    disabled={isSending}
                    onChange={(event) =>
                      setInput(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();

                        if (input.trim()) {
                          void sendQuestion(input);
                        }
                      }
                    }}
                    placeholder="Ask your future self something..."
                    rows={2}
                    className="max-h-36 min-h-12 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 disabled:opacity-60"
                  />

                  <button
                    type="submit"
                    disabled={isSending || !input.trim()}
                    aria-label="Send message"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSending ? (
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>

                <p className="mt-3 text-center text-xs text-muted">
                  Responses are AI-generated decision-support
                  scenarios, not guaranteed predictions.
                </p>
              </form>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}