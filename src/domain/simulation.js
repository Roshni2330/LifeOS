import { average, clamp, seededNumber } from "./math.js";
import { validateSimulationBundle } from "./schemas.js";

const DISCLAIMER = "LifeOS scenarios are decision-support tools, not guaranteed predictions. Outcomes depend on changing circumstances and your actions.";
const hooks = ["Build a public portfolio project", "Ask for feedback from a mentor", "Protect two recovery blocks each week", "Review your savings runway"];

export function createSimulations(profile, dna, changes = {}) {
  const futures = profile.options.map((option, index) => createFuture(profile, dna, option, index, changes));
  while (futures.length < 3) futures.push(createFuture(profile, dna, `Deliberate exploration path ${futures.length + 1}`, futures.length, changes));
  const sorted = [...futures].sort((a, b) => wellbeing(b) - wellbeing(a));
  const safest = [...futures].sort((a, b) => b.scores.finance - a.scores.finance)[0];
  const growth = [...futures].sort((a, b) => b.scores.career + b.scores.learning - b.scores.stress)[0];
  const bundle = { id: crypto.randomUUID(), generatedAt: new Date().toISOString(), changes, futures, recommendation: {
    bestSafeChoice: safest.id, bestHighGrowthChoice: growth.id, bestBalancedChoice: sorted[0].id,
    recommendedFutureId: sorted[0].id,
    rationale: `${sorted[0].title} best fits the current Decision DNA by balancing ${dna.financialStabilityNeed.score >= 65 ? "financial security" : "learning momentum"}, ambition, and a sustainable pace.`
  }, disclaimer: DISCLAIMER };
  return validateSimulationBundle(bundle);
}

function createFuture(profile, dna, option, index, changes) {
  const seed = `${profile.name}:${option}`;
  const lower = option.toLowerCase();
  const stability = /tcs|corporate|job|join|salary|offer/.test(lower) ? 14 : /study|master|higher/.test(lower) ? -8 : 0;
  const growth = /microsoft|product|startup|prepare|switch|entrepreneur/.test(lower) ? 14 : /study|master|higher/.test(lower) ? 10 : 2;
  const study = changes.studyDaily ? 10 : 0;
  const learningSalary = changes.lowerSalaryForLearning ? 8 : 0;
  const city = changes.moveCity ? 5 : 0;
  const exercise = changes.exercise ? 8 : 0;
  const delayStudy = changes.delayHigherStudies ? 7 : 0;
  const risk = changes.financialRisk ? 8 : 0;
  const projects = changes.monthlyProject ? 9 : 0;
  const noise = seededNumber(seed, index);
  const career = clamp(58 + growth + study + learningSalary + city + projects + noise);
  const finance = clamp(62 + stability - learningSalary * 0.6 - risk - (lower.includes("study") ? 8 : 0) + noise);
  const learning = clamp(57 + growth + study + learningSalary + projects + delayStudy * 0.5 + noise);
  const health = clamp(69 - growth * 0.35 - risk * 0.4 + exercise + (dna.workLifePriority.score - 50) * 0.12 - noise);
  const relationships = clamp(67 - city * 0.35 - growth * 0.18 + exercise * 0.2 + (dna.workLifePriority.score - 50) * 0.12);
  const stress = clamp(54 + growth * 0.6 + risk + (100 - finance) * 0.18 - exercise * 0.65 - stability * 0.22 - noise);
  const regret = clamp(47 - career * 0.17 - learning * 0.14 + stress * 0.12 - dna.consistency.score * 0.1);
  const purpose = clamp(average([career, learning, relationships]) + (dna.ambition.score - 50) * 0.1);
  const scores = { career, finance, learning, health, relationships, purpose, stress, regret };
  const title = `${["Universe A", "Universe B", "Universe C"][index]}: ${option}`;
  return {
    id: `future-${index + 1}`, title, option, summary: summary(option, scores), confidence: clamp(74 - Math.abs(dna.riskTolerance.score - 50) * 0.12 - Math.abs(finance - 65) * 0.08), scores,
    timeline: makeTimeline(option, scores), risks: risks(option, scores), opportunities: opportunities(option, scores),
    assumptions: assumptions(profile, dna), actionPlan: actionPlan(profile, option),
    explanation: explanation(profile, dna, scores, option)
  };
}

function summary(option, scores) { return `${option} creates a ${scores.career >= 75 ? "strong growth" : "measured"} path with ${scores.finance >= 70 ? "reliable financial footing" : "a meaningful runway requirement"}.`; }
function makeTimeline(option, scores) { return Array.from({ length: 6 }, (_, i) => ({ year: 2026 + i, milestone: i === 0 ? `Commit to ${option}` : ["Build proof of skill", "Expand responsibility", "Make a strategic move", "Strengthen your position", "Choose the next horizon"][i - 1], financialPosition: `${clamp(scores.finance - 12 + i * 4)}/100 financial resilience`, skillLevel: `${clamp(scores.learning - 16 + i * 4)}/100`, stressLevel: `${clamp(scores.stress + 7 - i)}/100`, opportunity: i === 2 ? "Use demonstrated work to unlock a higher-leverage role." : "Compound one visible skill and one trusted relationship.", risk: i === 0 ? "Early expectations may differ from reality." : "Momentum can stall without deliberate practice." })); }
function risks(option, scores) { return [scores.stress > 65 ? "Sustained intensity could erode health and consistency." : "Comfort may reduce deliberate skill-building.", scores.finance < 60 ? "The path needs a defined savings runway before major commitments." : "Income stability can create complacency around long-term growth.", `The assumptions behind ${option} may change with the job market or admissions outcomes.`]; }
function opportunities(option, scores) { return [scores.learning >= 75 ? "Visible projects can turn learning into credible career signal." : "A weekly learning system can materially lift this trajectory.", "Mentors and peer accountability can reduce decision risk.", `Use early milestones from ${option} to negotiate the next opportunity.`]; }
function assumptions(profile, dna) { return ["You can sustain at least five focused hours a week toward your goal.", `Financial pressure is interpreted as ${dna.financialStabilityNeed.score}/100 from your input.`, "The job, education, and local market conditions remain broadly accessible.", `${profile.priorities} remains an important priority over this horizon.`]; }
function actionPlan(profile, option) { return [{ timeframe: "Today", task: `Write a one-page decision thesis for ${option}, including a stop condition.` }, { timeframe: "Today", task: "Block one 45-minute skill session on your calendar." }, { timeframe: "This week", task: "Speak to two people who took a similar path and record their trade-offs." }, { timeframe: "This week", task: "Set a savings, applications, or project metric that proves progress." }, { timeframe: "This month", task: `Ship one concrete artifact that moves ${profile.mainGoal} forward.` }]; }
function explanation(profile, dna, scores, option) { return { inputsUsed: ["financial pressure", "risk tolerance", "skills", "goal", "time available", "lifestyle priorities"], scoreRationale: { career: `Career reflects ${option}'s learning and opportunity signal plus your ambition (${dna.ambition.score}/100).`, finance: `Finance weighs your stated financial stability need (${dna.financialStabilityNeed.score}/100) against income certainty.`, stress: `Stress increases with uncertainty and intensity, then decreases with habits that protect recovery.` }, couldImprove: ["Build a six-month savings buffer.", "Complete one visible project every month.", "Review workload and health indicators weekly."], couldWorsen: ["Ignoring financial runway.", "Treating the decision as final instead of revisiting it with evidence."], profileSummary: `${profile.name}'s Decision DNA is the basis for this scenario; it is not an assessment of inherent ability.` }; }
function wellbeing(future) { const s = future.scores; return s.career + s.finance + s.learning + s.health + s.relationships + s.purpose - s.stress - s.regret; }
