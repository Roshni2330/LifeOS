import { HttpError } from "../http.js";

const scoreKeys = ["career", "finance", "health", "relationships", "learning", "stress", "regret", "purpose"];
export function validateSimulationBundle(bundle) {
  if (!bundle || !Array.isArray(bundle.futures) || bundle.futures.length !== 3) throw new HttpError(502, "The AI response did not contain exactly three futures.");
  for (const future of bundle.futures) {
    if (!future.title || !future.summary || !Number.isFinite(future.confidence)) throw new HttpError(502, "The AI response has an incomplete future.");
    for (const key of scoreKeys) if (!Number.isFinite(future.scores?.[key])) throw new HttpError(502, `The AI response is missing the ${key} score.`);
    if (!Array.isArray(future.timeline) || !Array.isArray(future.risks) || !Array.isArray(future.opportunities) || !Array.isArray(future.assumptions) || !Array.isArray(future.actionPlan)) throw new HttpError(502, "The AI response has invalid scenario collections.");
  }
  return bundle;
}

export const SIMULATION_JSON_SCHEMA = {
  type: "object", additionalProperties: false,
  required: ["futures", "recommendation", "disclaimer"],
  properties: {
    disclaimer: { type: "string" }, recommendation: { type: "object" },
    futures: { type: "array", minItems: 3, maxItems: 3, items: { type: "object" } }
  }
};
