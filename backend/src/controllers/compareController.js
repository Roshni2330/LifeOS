const { askGroq } = require("../services/groqService");

function normalizeScore(value) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return 50;
  }

  if (numericValue <= 10) {
    return Math.round(numericValue * 10);
  }

  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

async function compareFutures(req, res) {
  try {
    const {
      leftFuture,
      rightFuture,
      decisionDNA,
      lifeScores,
      userProfile,
    } = req.body;

    if (!leftFuture || !rightFuture) {
      return res.status(400).json({
        success: false,
        message: "Two futures are required for comparison.",
      });
    }

    if (leftFuture.id === rightFuture.id) {
      return res.status(400).json({
        success: false,
        message: "Please select two different futures.",
      });
    }

    const prompt = `
You are LifeOS AI, a realistic decision-comparison engine.

Compare these two possible futures.

Future A:
${JSON.stringify(leftFuture)}

Future B:
${JSON.stringify(rightFuture)}

Decision DNA:
${JSON.stringify(decisionDNA || {})}

Current Life Scores:
${JSON.stringify(lifeScores || {})}

User Profile:
${JSON.stringify(userProfile || {})}

Return exactly one valid JSON object using this structure:

{
  "winnerId": "future id",
  "confidence": 0,
  "explanation": "string",
  "tradeoff": "string",
  "categoryWinners": {
    "career": "future id",
    "finance": "future id",
    "learning": "future id",
    "wellbeing": "future id",
    "relationships": "future id",
    "stress": "future id",
    "regret": "future id"
  },
  "scores": {
    "left": {
      "career": 0,
      "finance": 0,
      "learning": 0,
      "wellbeing": 0,
      "relationships": 0,
      "stress": 0,
      "regret": 0
    },
    "right": {
      "career": 0,
      "finance": 0,
      "learning": 0,
      "wellbeing": 0,
      "relationships": 0,
      "stress": 0,
      "regret": 0
    }
  }
}

Rules:

- All scores must be integers between 0 and 100.
- Higher is better for career, finance, learning, wellbeing and relationships.
- Lower is better for stress and regret.
- winnerId must exactly match either "${leftFuture.id}" or "${rightFuture.id}".
- Base the result on the user's priorities and the futures provided.
- Explain the winner honestly and mention an important trade-off.
- Do not claim that any outcome is guaranteed.
- Return JSON only.
`;

    const response = await askGroq(prompt, true);

    let parsed;

    try {
      parsed = JSON.parse(response);
    } catch (error) {
      console.error("Invalid comparison JSON:", response);

      return res.status(500).json({
        success: false,
        message: "AI returned an invalid comparison.",
      });
    }

    const allowedFutureIds = [
      String(leftFuture.id),
      String(rightFuture.id),
    ];

    const normalizeWinner = (winnerId) =>
      allowedFutureIds.includes(String(winnerId))
        ? String(winnerId)
        : String(leftFuture.id);

    const normalizeCategoryWinners = (categoryWinners = {}) => ({
      career: normalizeWinner(categoryWinners.career),
      finance: normalizeWinner(categoryWinners.finance),
      learning: normalizeWinner(categoryWinners.learning),
      wellbeing: normalizeWinner(categoryWinners.wellbeing),
      relationships: normalizeWinner(
        categoryWinners.relationships,
      ),
      stress: normalizeWinner(categoryWinners.stress),
      regret: normalizeWinner(categoryWinners.regret),
    });

    const normalizeScoreSet = (scores = {}) => ({
      career: normalizeScore(scores.career),
      finance: normalizeScore(scores.finance),
      learning: normalizeScore(scores.learning),
      wellbeing: normalizeScore(scores.wellbeing),
      relationships: normalizeScore(scores.relationships),
      stress: normalizeScore(scores.stress),
      regret: normalizeScore(scores.regret),
    });

    return res.status(200).json({
      success: true,
      comparison: {
        winnerId: normalizeWinner(parsed.winnerId),
        confidence: normalizeScore(parsed.confidence),
        explanation:
          typeof parsed.explanation === "string"
            ? parsed.explanation
            : "Both futures offer different advantages.",
        tradeoff:
          typeof parsed.tradeoff === "string"
            ? parsed.tradeoff
            : "The best choice depends on the priorities you value most.",
        categoryWinners: normalizeCategoryWinners(
          parsed.categoryWinners,
        ),
        scores: {
          left: normalizeScoreSet(parsed.scores?.left),
          right: normalizeScoreSet(parsed.scores?.right),
        },
      },
    });
  } catch (error) {
    console.error("Future comparison failed:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Future comparison failed.",
    });
  }
}

module.exports = {
  compareFutures,
};