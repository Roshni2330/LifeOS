import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "../src/server.js";
import { LifeOSService } from "../src/services/lifeos.js";
import { SimulationStore } from "../src/store.js";

const profile = { name: "Roshni", age: 22, currentRole: "Computer science student", skills: "JavaScript, Python, data analysis", mainGoal: "Become a product-focused data engineer", decision: "Choose a next step", options: ["Join TCS", "Prepare for Microsoft", "Pursue higher studies"], financialPressure: 70, riskTolerance: 62, lifestyle: "Balanced city life", priorities: "health and family time", timeAvailable: 70 };
const service = () => new LifeOSService({ store: new SimulationStore(), provider: { generateSimulations: async () => null }, logger: { warn() {} } });

test("creates exactly three grounded scenarios", async () => {
  const result = await service().simulate(profile);
  assert.equal(result.futures.length, 3);
  assert.equal(result.futures[0].timeline.length, 6);
  assert.ok(result.futures.every((future) => future.scores.career >= 0 && future.scores.career <= 100));
  assert.match(result.disclaimer, /not guaranteed predictions/i);
});

test("butterfly changes recalculate the selected indicators", async () => {
  const api = service(); const before = await api.simulate(profile); const after = await api.recalculate(before.id, { studyDaily: true, exercise: true, monthlyProject: true });
  assert.ok(after.futures[0].scores.learning > before.futures[0].scores.learning);
  assert.ok(after.futures[0].scores.stress < before.futures[0].scores.stress);
});

test("future chat stays grounded in the selected future", async () => {
  const api = service(); const result = await api.simulate(profile); const answer = api.chat({ simulationId: result.id, futureId: "future-1", message: "What was the hardest part?" });
  assert.equal(answer.role, "future-self"); assert.equal(answer.futureId, "future-1"); assert.ok(answer.grounding.risk);
});

test("falls back cleanly when the AI provider fails", async () => {
  const api = new LifeOSService({ store: new SimulationStore(), provider: { generateSimulations: async () => { throw new Error("provider down"); } }, logger: { warn() {} } });
  const result = await api.simulate(profile);
  assert.equal(result.futures.length, 3);
});

test("HTTP endpoint returns Decision DNA", async () => {
  const server = createServer(service()); await new Promise((resolve) => server.listen(0, resolve));
  try { const response = await fetch(`http://127.0.0.1:${server.address().port}/api/profile/analyze`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ profile }) }); const body = await response.json(); assert.equal(response.status, 200); assert.ok(body.decisionDna.ambition.score); } finally { await new Promise((resolve) => server.close(resolve)); }
});
