import { buildDecisionDna, validateProfile } from "../domain/profile.js";
import { createSimulations } from "../domain/simulation.js";
import { replyAsFutureSelf } from "../domain/chat.js";
import { HttpError } from "../http.js";

export class LifeOSService {
  constructor({ store, provider, logger = console } = {}) { this.store = store; this.provider = provider; this.logger = logger; }
  analyze(profile) { return buildDecisionDna(profile); }
  async simulate(profile, changes = {}) {
    validateProfile(profile); const dna = this.analyze(profile); let bundle;
    try { bundle = await this.provider?.generateSimulations(profile, dna, changes); } catch (error) { this.logger.warn(`AI provider unavailable; using deterministic scenario engine: ${error.message}`); }
    bundle ||= createSimulations(profile, dna, changes);
    return this.store.save(bundle, { profile, dna });
  }
  async recalculate(simulationId, changes) { const item = this.store.get(simulationId); if (!item) throw new HttpError(404, "Simulation not found. Start a new simulation."); return this.simulate(item.profile, { ...item.bundle.changes, ...changes }); }
  future(simulationId, futureId) { const item = this.store.get(simulationId); const future = item?.bundle.futures.find((entry) => entry.id === futureId); if (!future) throw new HttpError(404, "Future not found."); return { item, future }; }
  chat(input) { const { item, future } = this.future(input.simulationId, input.futureId); return replyAsFutureSelf({ profile: item.profile, dna: item.dna, future, message: input.message }); }
  actionPlan(input) { const { future } = this.future(input.simulationId, input.futureId); return { futureId: future.id, tasks: future.actionPlan, nextSixMonths: ["Set a monthly portfolio milestone.", "Track savings or runway at the end of each month.", "Apply, network, or seek feedback twice monthly.", "Protect an exercise and recovery routine."], disclaimer: "These are practical suggestions, not guarantees." }; }
  report(input) { const { item, future } = this.future(input.simulationId, input.futureId); return { title: "LifeOS Decision Report", generatedAt: new Date().toISOString(), profile: { name: item.profile.name, goal: item.profile.mainGoal, decision: item.profile.decision }, decisionDna: item.dna, futures: item.bundle.futures.map(({ title, summary, scores, confidence }) => ({ title, summary, scores, confidence })), selectedFuture: future, recommendation: item.bundle.recommendation, butterflyChanges: item.bundle.changes, disclaimer: item.bundle.disclaimer }; }
}
