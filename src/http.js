export async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  if (!text) return {};
  try { return JSON.parse(text); } catch { throw new HttpError(400, "Request body must be valid JSON."); }
}

export function sendJson(response, status, body) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

export class HttpError extends Error {
  constructor(status, message, details) { super(message); this.status = status; this.details = details; }
}

export function requireFields(value, fields) {
  const missing = fields.filter((field) => !value?.[field] || (typeof value[field] === "string" && !value[field].trim()));
  if (missing.length) throw new HttpError(422, `Missing required fields: ${missing.join(", ")}.`, { missing });
}
