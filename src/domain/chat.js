import { HttpError } from "../http.js";

export function replyAsFutureSelf({ profile, dna, future, message }) {
  if (!message?.trim()) throw new HttpError(422, "A chat message is required.");
  const text = message.toLowerCase();
  const timelineEvent = future.timeline[1] || future.timeline[0];
  let insight = `The decision mattered, but the repeated work after it mattered more. By ${timelineEvent.year}, I had learned to protect time for ${timelineEvent.milestone.toLowerCase()}.`;
  if (/regret|mistake/.test(text)) insight = `I regret waiting for certainty. The avoidable mistake was letting anxiety replace small experiments; a weekly review would have shown what was actually working.`;
  if (/hard|difficult/.test(text)) insight = `The hardest part was managing uncertainty while keeping momentum. I handled it by shrinking the next step to one week and tracking visible evidence of progress.`;
  if (/happy|happier/.test(text)) insight = `I felt happiest when the work matched my values and did not consume my health. The score improved when I treated rest and relationships as constraints, not rewards.`;
  if (/start|today/.test(text)) insight = `Start with one accountable action today: ${future.actionPlan[0].task}`;
  return { role: "future-self", futureId: future.id, message: `I’m ${profile.name} in 2031, looking back on ${future.option}. ${insight} Your current profile showed a ${dna.financialStabilityNeed.score >= 65 ? "real need for stability" : "usable capacity to experiment"}, so I would keep that in view.`, grounding: { timelineYear: timelineEvent.year, risk: future.risks[0], assumption: future.assumptions[0] } };
}
