const { askGroq } = require("../services/groqService");

function normalizeScore(value) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return 0;
  }

  if (numericValue <= 10) {
    return Math.round(numericValue * 10);
  }

  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

async function generateSimulation(req, res) {
  try {
    const {
      name,
      age,
      currentRole,
      goal,
      decision,
      priorities,
      options,
    } = req.body;

    if (
      !name ||
      !age ||
      !currentRole ||
      !goal ||
      !decision ||
      !Array.isArray(options) ||
      options.length < 2
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Name, age, current role, goal, decision and at least two options are required.",
      });
    }

    const prompt = `
You are LifeOS AI, a realistic decision-simulation engine.

Return exactly one valid JSON object.

Do not return markdown.
Do not return code fences.
Do not return comments.
Do not write anything before or after the JSON.

Use this exact structure:

{
  "decisionDNA": {
    "riskTolerance": 0,
    "learningDrive": 0,
    "financialPriority": 0,
    "workLifePriority": 0
  },
  "lifeScores": {
    "career": 0,
    "finance": 0,
    "learning": 0,
    "health": 0,
    "stress": 0
  },
  "recommendation": "string",
  "timeline": [
    "string",
    "string",
    "string",
    "string",
    "string"
  ],
  "futures": [
    {
      "id": "growth",
      "title": "string",
      "subtitle": "string",
      "score": 0,
      "summary": "string",
      "tags": ["string", "string", "string"]
    },
    {
      "id": "stable",
      "title": "string",
      "subtitle": "string",
      "score": 0,
      "summary": "string",
      "tags": ["string", "string", "string"]
    },
    {
      "id": "studies",
      "title": "string",
      "subtitle": "string",
      "score": 0,
      "summary": "string",
      "tags": ["string", "string", "string"]
    }
  ]
}

All numeric scores must be integers between 0 and 100.

User information:

Name: ${name}
Age: ${age}
Current role: ${currentRole}
Goal: ${goal}
Decision: ${decision}
Priorities: ${JSON.stringify(priorities)}
Options: ${JSON.stringify(options)}

Requirements:

- Generate exactly three meaningfully different futures.
- Keep the future ids exactly "growth", "stable", and "studies".
- Make the recommendation directly relevant to the user's goal and options.
- Keep each summary concise and realistic.
- Timeline must contain exactly five milestones.
- Tags must contain exactly three short strings.
- Stress is a negative score, where a higher number means more stress.
- Return only valid JSON.
`;

    const response = await askGroq(prompt, true);

    let parsed;

    try {
      parsed = JSON.parse(response);
    } catch (parseError) {
      console.error("Invalid AI JSON:", response);

      return res.status(500).json({
        success: false,
        error: "AI returned invalid JSON.",
        raw: response,
      });
    }

    parsed.decisionDNA = {
      riskTolerance: normalizeScore(
        parsed.decisionDNA?.riskTolerance,
      ),
      learningDrive: normalizeScore(
        parsed.decisionDNA?.learningDrive,
      ),
      financialPriority: normalizeScore(
        parsed.decisionDNA?.financialPriority,
      ),
      workLifePriority: normalizeScore(
        parsed.decisionDNA?.workLifePriority,
      ),
    };

    parsed.lifeScores = {
      career: normalizeScore(parsed.lifeScores?.career),
      finance: normalizeScore(parsed.lifeScores?.finance),
      learning: normalizeScore(parsed.lifeScores?.learning),
      health: normalizeScore(parsed.lifeScores?.health),
      stress: normalizeScore(parsed.lifeScores?.stress),
    };

    parsed.recommendation =
      typeof parsed.recommendation === "string"
        ? parsed.recommendation
        : "Review the generated futures and choose the path that best matches your priorities.";

    parsed.timeline = Array.isArray(parsed.timeline)
      ? parsed.timeline.slice(0, 5).map(String)
      : [];

    parsed.futures = Array.isArray(parsed.futures)
      ? parsed.futures.slice(0, 3).map((future, index) => {
          const fallbackIds = ["growth", "stable", "studies"];

          return {
            id:
              typeof future?.id === "string"
                ? future.id
                : fallbackIds[index],
            title:
              typeof future?.title === "string"
                ? future.title
                : `Future ${index + 1}`,
            subtitle:
              typeof future?.subtitle === "string"
                ? future.subtitle
                : "Possible life path",
            score: normalizeScore(future?.score),
            summary:
              typeof future?.summary === "string"
                ? future.summary
                : "A possible future based on your goals and priorities.",
            tags: Array.isArray(future?.tags)
              ? future.tags.slice(0, 3).map(String)
              : [],
          };
        })
      : [];

    return res.status(200).json({
      success: true,
      simulation: parsed,
    });
  } catch (error) {
    console.error("Simulation generation failed:", error);

    return res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Simulation generation failed.",
    });
  }
}

module.exports = {
  generateSimulation,
};