"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bot,
  MessageCircleMore,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useParams } from "next/navigation";

type Message = {
  id: number;
  role: "user" | "future";
  text: string;
};

const futureProfiles = {
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
    responses: {
      regret:
        "My biggest regret was waiting too long before applying for better opportunities. I kept thinking I needed one more course or one more project.",
      hard:
        "The hardest part was staying patient. Growth was steady, but it sometimes felt slow compared to people taking bigger risks.",
      today:
        "Start building strong fundamentals, publish visible projects and apply before you feel fully ready.",
      happy:
        "Yes, mostly. Stability reduced stress and gave me freedom, but I still had to create challenges for myself to keep growing.",
      fallback:
        "This future worked because consistency mattered more than one perfect decision. Keep learning, apply early and do not let fear disguise itself as preparation.",
    },
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
    responses: {
      regret:
        "I regret treating exhaustion like proof of ambition. The path was worth it, but I should have built healthier boundaries much earlier.",
      hard:
        "The hardest part was uncertainty. Some months felt exciting and others felt like everything could collapse.",
      today:
        "Build one excellent project, improve your communication and put yourself in environments where your learning speed increases.",
      happy:
        "Yes, but only after I stopped linking my entire identity to work. Growth felt meaningful once I created balance.",
      fallback:
        "The ambitious path rewarded speed, courage and adaptability. Take bold steps, but do not confuse burnout with progress.",
    },
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
    responses: {
      regret:
        "I sometimes regretted how late financial stability arrived, especially when friends were already earning and progressing.",
      hard:
        "The hardest part was staying motivated during long research cycles when progress was difficult to measure.",
      today:
        "Strengthen mathematics, build research-oriented projects and verify that you genuinely enjoy deep study before committing.",
      happy:
        "Yes. The path matched my curiosity and gave me meaningful work, although it required patience.",
      fallback:
        "Higher studies worked because I enjoyed the learning itself, not only the final degree. Choose it for depth, not as an escape from uncertainty.",
    },
  },
};

export default function FutureChatPage() {
  const params = useParams<{ id: string }>();
  const futureId = params.id ?? "stable";

  const profile =
    futureProfiles[futureId as keyof typeof futureProfiles] ??
    futureProfiles.stable;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "future",
      text: `Hi. I’m the version of you who chose the ${profile.title.toLowerCase()}. ${profile.intro}`,
    },
  ]);

  const nextId = useMemo(() => messages.length + 1, [messages.length]);

  function generateReply(question: string) {
    const normalized = question.toLowerCase();

    if (normalized.includes("regret")) {
      return profile.responses.regret;
    }

    if (
      normalized.includes("hard") ||
      normalized.includes("difficult") ||
      normalized.includes("stress")
    ) {
      return profile.responses.hard;
    }

    if (
      normalized.includes("today") ||
      normalized.includes("start") ||
      normalized.includes("prepare") ||
      normalized.includes("avoid")
    ) {
      return profile.responses.today;
    }

    if (
      normalized.includes("happy") ||
      normalized.includes("worth") ||
      normalized.includes("choose again")
    ) {
      return profile.responses.happy;
    }

    return profile.responses.fallback;
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput) {
      return;
    }

    const userMessage: Message = {
      id: nextId,
      role: "user",
      text: trimmedInput,
    };

    const futureMessage: Message = {
      id: nextId + 1,
      role: "future",
      text: generateReply(trimmedInput),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      futureMessage,
    ]);

    setInput("");
  }

  function askStarterQuestion(question: string) {
    const userMessage: Message = {
      id: nextId,
      role: "user",
      text: question,
    };

    const futureMessage: Message = {
      id: nextId + 1,
      role: "future",
      text: generateReply(question),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      futureMessage,
    ]);
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
              Future Self Conversation
            </p>

            <h1 className="text-gradient mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Talk to the version of you who lived this path
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted">
              Ask about regrets, difficult moments, happiness and what you
              should begin doing today.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
            <aside className="glass-panel h-fit rounded-3xl p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20">
                <UserRound size={30} className="text-white" />
              </div>

              <p className="mt-6 text-sm text-secondary">{profile.subtitle}</p>

              <h2 className="mt-1 text-2xl font-semibold text-white">
                {profile.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted">
                This version of you answers from the selected future scenario.
              </p>

              <div className="mt-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                  Suggested questions
                </p>

                <div className="mt-4 space-y-3">
                  {profile.starterQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => askStarterQuestion(question)}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm leading-6 text-slate-300 transition hover:border-secondary/30 hover:bg-secondary/[0.06] hover:text-white"
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
                  <h2 className="font-semibold text-white">Future You</h2>
                  <p className="text-xs text-success">
                    Connected to 2035 simulation
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
              </div>

              <form
                onSubmit={submitMessage}
                className="border-t border-white/10 p-4 sm:p-5"
              >
                <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2 focus-within:border-secondary/40">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask your future self something..."
                    rows={2}
                    className="max-h-36 min-h-12 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600"
                  />

                  <button
                    type="submit"
                    aria-label="Send message"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white transition hover:scale-105"
                  >
                    <Send size={18} />
                  </button>
                </div>

                <p className="mt-3 text-center text-xs text-muted">
                  Future responses are simulated decision-support scenarios.
                </p>
              </form>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}