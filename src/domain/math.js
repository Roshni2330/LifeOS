export const clamp = (value, min = 0, max = 100) => Math.round(Math.max(min, Math.min(max, value)));
export const average = (values) => Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
export function seededNumber(seed, offset = 0) {
  let hash = 2166136261 + offset;
  for (let i = 0; i < seed.length; i++) hash = Math.imul(hash ^ seed.charCodeAt(i), 16777619);
  return ((hash >>> 0) % 19) - 9;
}
