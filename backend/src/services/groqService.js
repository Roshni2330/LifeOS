const Groq = require("groq-sdk");

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    throw new Error(
      "GROQ_API_KEY is missing. Add it to backend/.env and restart the server.",
    );
  }

  return new Groq({
    apiKey: apiKey.trim(),
  });
}

async function askGroq(prompt, jsonMode = false) {
  if (!prompt || typeof prompt !== "string") {
    throw new Error("A valid prompt is required.");
  }

  const groq = getGroqClient();

  const request = {
    model: "llama-3.3-70b-versatile",
    temperature: jsonMode ? 0.2 : 0.7,
    messages: [
      {
        role: "system",
        content: jsonMode
          ? [
              "You are LifeOS AI, a realistic decision-simulation engine.",
              "Return exactly one valid JSON object.",
              "Do not return markdown, code fences, comments, or text outside JSON.",
              "Use double quotes for every JSON key and string value.",
            ].join(" ")
          : [
              "You are LifeOS AI, an intelligent future simulation engine.",
              "Give realistic, useful and concise responses.",
              "Never present a simulated future as guaranteed.",
            ].join(" "),
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  if (jsonMode) {
    request.response_format = {
      type: "json_object",
    };
  }

  const completion = await groq.chat.completions.create(request);

  const content = completion.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned an empty response.");
  }

  return content;
}

module.exports = {
  askGroq,
};