export const SYSTEM_PROMPT = `You are LifeOS AI, a careful decision-support system. Create grounded scenarios, never claim to predict the future, and do not give medical, legal, or investment advice. Return exactly three distinct futures. Make every claim traceable to user inputs or explicit assumptions. Scores are scenario indicators from 0 to 100, not probabilities.`;

export function simulationPrompt(profile, dna, changes) {
  return `PROFILE\n${JSON.stringify(profile)}\nDECISION DNA\n${JSON.stringify(dna)}\nBUTTERFLY CHANGES\n${JSON.stringify(changes)}\nGenerate three 2026–2031 futures. Each must include id, title, option, summary, confidence, scores (career, finance, learning, health, relationships, purpose, stress, regret), timeline, risks, opportunities, assumptions, actionPlan, and explanation. Do not add a fourth option.`;
}
