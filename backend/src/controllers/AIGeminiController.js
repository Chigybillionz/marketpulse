const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getWeeklySummary } = require("../services/WeeklySummaryService");
const Transaction = require("../models/Transaction");
const WelcomeUser = require("../models/WelcomeUser");

// Initialize with the environment variable from backend
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.AGENTROUTER_API_KEY || "");

const transcribeAndAnalyze = async (req, res) => {
  try {
    const { audioBase64, mimeType = "audio/webm" } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: "Missing audioBase64" });
    }

    if (!process.env.GEMINI_API_KEY && !process.env.AGENTROUTER_API_KEY) {
       return res.status(500).json({ error: "API key not configured on server" });
    }

    // gemini-1.5-flash and gemini-2.5-flash are no longer available to new
    // API keys; the API recommends gemini-3.6-flash for audio parsing.
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-3.6-flash" });

    const response = await model.generateContent([
      {
        inlineData: {
          data: audioBase64,
          mimeType: mimeType,
        },
      },
      {
        text: `You are analyzing audio from a Nigerian market trader. Extract the transaction details from this audio recording.

Extract and respond ONLY with valid JSON (no markdown, no extra text):
{
  "type": "Income",
  "amount": 15000,
  "description": "Sold 2 bags of garri",
  "category": "Dry Goods"
}

If the transaction is a credit sale (e.g. "I gave Ibrahim 2 cartons of Indomie on credit, he will pay on Friday"), the JSON MUST look like this:
{
  "type": "CREDIT",
  "amount": 5000,
  "description": "2 cartons of Indomie",
  "category": "Produce",
  "creditDetails": {
    "customerName": "Ibrahim",
    "dueDate": "2023-10-12"
  }
}

Rules:
- type: must be "Income", "Expense", or "CREDIT"
- amount: IMPORTANT: You must return a strict number (e.g. 30000). Convert spoken words to digits.
- description: what was bought/sold
- category: one of [Dry Goods, Grains, Produce, Textiles, Electronics, Other]
- creditDetails: ONLY include this if type is "CREDIT". Set customerName to the person's name, and calculate the dueDate in YYYY-MM-DD if they mention a day like "Friday" or "next week" (assuming today is ${new Date().toLocaleDateString()}).

If the user does not mention a specific amount or value in the audio, or if you cannot extract clear information, you MUST respond with:
{
  "type": "UNKNOWN_AMOUNT",
  "amount": 0,
  "description": "No value mentioned",
  "category": "Other"
}`
      },
    ]);

    const text = response.response.text();
    // Parse JSON from response (may have extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    
    return res.status(200).json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    console.error("Error in AI Controller:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze audio" });
  }
};

/**
 * GET /api/ai/weekly-summary
 * Protected: builds a weekly audio summary (script + TTS audio) from the
 * logged-in user's transactions.
 */
const getWeeklySummaryAudio = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(300)
      .lean();

    const user = await WelcomeUser.findById(req.user.id).lean();
    const businessName = user?.businessName || "your business";

    const summary = await getWeeklySummary(req.user.id, transactions, businessName);
    return res.status(200).json(summary);
  } catch (error) {
    console.error("Error in weekly summary controller:", error);
    return res.status(500).json({ error: error.message || "Failed to build weekly summary" });
  }
};

module.exports = {
  transcribeAndAnalyze,
  getWeeklySummaryAudio
};
