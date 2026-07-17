const { askGroq } = require("../services/groqService");

async function butterflyEffect(req, res) {
  try {
    const {
      future,
      studyHours,
      sleepHours,
      exercise,
      networking,
      projects,
    } = req.body;

    const prompt = `
You are LifeOS AI.

The user is already living this future:

${JSON.stringify(future)}

Daily Habits

Study Hours: ${studyHours}

Sleep Hours: ${sleepHours}

Exercise: ${exercise}

Networking: ${networking}

Projects per Month: ${projects}

Return ONLY valid JSON.

{
"career":0,
"learning":0,
"health":0,
"stress":0,
"finance":0,
"summary":"..."
}

Scores must be between 0 and 100.

Summary should explain how these new habits change the future.
`;

    const response = await askGroq(prompt, true);

    res.json({
      success: true,
      result: JSON.parse(response),
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      success:false,

      message:err.message

    });

  }

}

module.exports = {

  butterflyEffect,

};