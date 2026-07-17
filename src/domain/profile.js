import { clamp } from "./math.js";
import { HttpError, requireFields } from "../http.js";

export function validateProfile(profile) {
  requireFields(profile, ["name", "age", "currentRole", "skills", "mainGoal", "decision", "options", "financialPressure", "riskTolerance", "lifestyle", "priorities", "timeAvailable"]);
  if (!Array.isArray(profile.options) || profile.options.length < 2) throw new HttpError(422, "Provide at least two decision options.");
  if (profile.options.length > 3) throw new HttpError(422, "LifeOS supports a maximum of three options per simulation.");
  return profile;
}

const toNumber = (value, fallback = 50) => typeof value === "number" ? clamp(value) : fallback;

export function buildDecisionDna(profile) {
  validateProfile(profile);
  const risk = toNumber(profile.riskTolerance);
  const financialPressure = toNumber(profile.financialPressure);
  const time = toNumber(profile.timeAvailable);
  const text = `${profile.skills} ${profile.mainGoal} ${profile.currentRole}`.toLowerCase();
  const technicalSignal = /code|software|data|design|engineer|analysis|research/.test(text) ? 12 : 0;
  const healthSignal = /health|balance|family|well.?being/.test(String(profile.priorities).toLowerCase()) ? 12 : 0;
  return {
    riskTolerance: trait(risk, "Comfort with uncertain paths and variable outcomes."),
    learningAbility: trait(clamp(56 + technicalSignal + time * 0.2), "Capacity to compound skills through focused practice."),
    financialStabilityNeed: trait(clamp(35 + financialPressure * 0.62), "Need for dependable income and a cash buffer."),
    ambition: trait(clamp(52 + risk * 0.28 + time * 0.18), "Drive to pursue a demanding, higher-upside goal."),
    consistency: trait(clamp(48 + time * 0.3), "Ability to sustain small, repeatable actions."),
    workLifePriority: trait(clamp(45 + healthSignal + (100 - risk) * 0.12), "Preference for health, time, and sustainable pace."),
    adaptability: trait(clamp(52 + risk * 0.25 + technicalSignal), "Readiness to learn, relocate, or change direction."),
    summary: `${profile.name}'s profile balances ${risk >= 60 ? "growth-oriented experimentation" : "measured decision-making"} with a ${financialPressure >= 60 ? "strong need for financial stability" : "manageable financial runway"}.`
  };
}

function trait(score, explanation) { return { score, explanation }; }
