const OpenAI = require("openai");

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn(
    "Warning: OPENAI_API_KEY is missing. AI endpoints will not work.",
  );
}

const openai = new OpenAI({
  apiKey,
});

async function testOpenAIConnection(message) {
  const response = await openai.responses.create({
    model: "gpt-5-mini",
    instructions:
      "You are the AI engine for LifeOS. Reply clearly in one short sentence.",
    input: message,
  });

  return response.output_text;
}

module.exports = {
  testOpenAIConnection,
};