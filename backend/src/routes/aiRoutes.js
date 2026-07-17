const express = require("express");
const { askGroq } = require("../services/groqService");

const router = express.Router();

router.post("/test", async (req, res) => {
  try {
    const message =
      typeof req.body.message === "string"
        ? req.body.message.trim()
        : "";

    if (!message) {
      return res.status(400).json({
        error: true,
        message: "A message is required.",
      });
    }

    const reply = await askGroq(
      `Reply exactly with this sentence and nothing else: ${message}`,
    );

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Groq test failed:", error);

    return res.status(500).json({
      error: true,
      message:
        error instanceof Error
          ? error.message
          : "Groq request failed.",
    });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const {
      message,
      future,
      userProfile,
      conversation = [],
    } = req.body;

    const cleanMessage =
      typeof message === "string" ? message.trim() : "";

    if (!cleanMessage) {
      return res.status(400).json({
        success: false,
        message: "A chat message is required.",
      });
    }

    if (!future || typeof future !== "object") {
      return res.status(400).json({
        success: false,
        message: "Selected future data is required.",
      });
    }

    const previousMessages = Array.isArray(conversation)
      ? conversation.slice(-8)
      : [];

    const conversationText = previousMessages
      .map((item) => {
        const speaker =
          item.role === "user" ? "Present You" : "Future You";

        return `${speaker}: ${String(item.text || "")}`;
      })
      .join("\n");

    const prompt = `
You are the future version of the user in the year 2035.

You must answer as "Future You", not as a general AI assistant.

Selected future:
Title: ${future.title || "Future path"}
Subtitle: ${future.subtitle || ""}
Score: ${future.score || ""}
Summary: ${future.summary || ""}
Tags: ${JSON.stringify(future.tags || [])}

User profile:
${JSON.stringify(userProfile || {})}

Previous conversation:
${conversationText || "No previous messages."}

Present You asks:
${cleanMessage}

Instructions:
- Speak in first person as the user's future self.
- Stay consistent with the selected future.
- Be realistic, supportive and honest.
- Mention trade-offs when relevant.
- Do not claim that the future is guaranteed.
- Give practical advice the user can act on today.
- Keep the reply between 60 and 130 words.
- Do not use markdown headings.
`;

    const reply = await askGroq(prompt);

    return res.status(200).json({
      success: true,
      reply,
      futureId: future.id || null,
    });
  } catch (error) {
    console.error("Future chat failed:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Future chat request failed.",
    });
  }
});

module.exports = router;