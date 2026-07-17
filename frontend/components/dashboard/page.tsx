import { Sparkles } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="glass-panel max-w-2xl rounded-[32px] p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
          <Sparkles size={28} className="text-white" />
        </div>

        <h1 className="text-gradient mt-6 text-4xl font-semibold">
          Your futures are ready
        </h1>

        <p className="mt-5 text-lg text-muted">
          Next, we will build your Multiverse Dashboard here.
        </p>
      </section>
    </main>
  );
}