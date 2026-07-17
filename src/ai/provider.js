import { SYSTEM_PROMPT, simulationPrompt } from "./prompts.js";
import { SIMULATION_JSON_SCHEMA, validateSimulationBundle } from "../domain/schemas.js";

export class OpenAIProvider {
  constructor({ apiKey = process.env.OPENAI_API_KEY, model = process.env.OPENAI_MODEL || "gpt-4.1-mini", fetchImpl = fetch } = {}) { this.apiKey = apiKey; this.model = model; this.fetch = fetchImpl; }
  get enabled() { return Boolean(this.apiKey); }
  async generateSimulations(profile, dna, changes) {
    if (!this.enabled) return null;
    const response = await this.fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { authorization: `Bearer ${this.apiKey}`, "content-type": "application/json" }, body: JSON.stringify({ model: this.model, instructions: SYSTEM_PROMPT, input: simulationPrompt(profile, dna, changes), text: { format: { type: "json_schema", name: "lifeos_simulations", strict: false, schema: SIMULATION_JSON_SCHEMA } } }) });
    if (!response.ok) throw new Error(`OpenAI request failed (${response.status}).`);
    const data = await response.json();
    const parsed = JSON.parse(data.output_text);
    return validateSimulationBundle(parsed);
  }
}
