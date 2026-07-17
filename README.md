# LifeOS AI backend

Dependency-free Node.js API for the LifeOS decision-support experience. It has a deterministic scenario engine for reliable demos and an optional OpenAI Responses API provider when `OPENAI_API_KEY` is configured.

## Run

```powershell
Copy-Item .env.example .env
npm run dev
```

`POST /api/profile/analyze`, `/api/simulations`, `/api/simulations/recalculate`, `/api/future-chat`, `/api/action-plan`, and `/api/report` are implemented. See `src/server.js` for request contracts.

All results are decision-support scenarios, not predictions or professional financial, medical, or career advice.
