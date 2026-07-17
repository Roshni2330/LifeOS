import http from "node:http";
import { fileURLToPath } from "node:url";
import { readJson, sendJson, HttpError, requireFields } from "./http.js";
import { SimulationStore } from "./store.js";
import { OpenAIProvider } from "./ai/provider.js";
import { LifeOSService } from "./services/lifeos.js";

export function createServer(service = new LifeOSService({ store: new SimulationStore(), provider: new OpenAIProvider() })) {
  return http.createServer(async (request, response) => {
    response.setHeader("access-control-allow-origin", "*"); response.setHeader("access-control-allow-headers", "content-type");
    if (request.method === "OPTIONS") return sendJson(response, 204, {});
    try {
      const body = request.method === "POST" ? await readJson(request) : {};
      let result;
      if (request.method === "GET" && request.url === "/health") result = { status: "ok", service: "lifeos-ai" };
      else if (request.method === "POST" && request.url === "/api/profile/analyze") result = { decisionDna: service.analyze(body.profile ?? body) };
      else if (request.method === "POST" && request.url === "/api/simulations") result = await service.simulate(body.profile, body.changes);
      else if (request.method === "POST" && request.url === "/api/simulations/recalculate") { requireFields(body, ["simulationId"]); result = await service.recalculate(body.simulationId, body.changes ?? {}); }
      else if (request.method === "POST" && request.url === "/api/future-chat") { requireFields(body, ["simulationId", "futureId", "message"]); result = service.chat(body); }
      else if (request.method === "POST" && request.url === "/api/action-plan") { requireFields(body, ["simulationId", "futureId"]); result = service.actionPlan(body); }
      else if (request.method === "POST" && request.url === "/api/report") { requireFields(body, ["simulationId", "futureId"]); result = service.report(body); }
      else if (request.method === "POST" && request.url === "/api/futures/explain") { requireFields(body, ["simulationId", "futureId"]); result = service.future(body.simulationId, body.futureId).future.explanation; }
      else throw new HttpError(404, "Route not found.");
      sendJson(response, 200, result);
    } catch (error) { sendJson(response, error instanceof HttpError ? error.status : 500, { error: error.message || "Unexpected server error.", details: error.details }); }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) { const port = Number(process.env.PORT || 3001); createServer().listen(port, () => console.log(`LifeOS API listening on http://localhost:${port}`)); }
