const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "Warning: GEMINI_API_KEY is missing. Gemini endpoints will not work.",
  );
}

async function askGemini(prompt) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in backend/.env");
  }

  if (!prompt || typeof prompt !== "string") {
    throw new Error("A valid prompt is required.");
  }

  const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message || "Gemini request failed.",
    );
  }

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}

module.exports = {
  askGemini,
};