import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const transcribeAndAnalyze = async (
  audioBase64,
  mimeType = "audio/wav",
) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

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

Rules:
- type: must be "Income" or "Expense"
- amount: number only (no currency symbol)
- description: what was bought/sold
- category: one of [Dry Goods, Grains, Produce, Textiles, Electronics, Other]

If you cannot extract clear information, respond with:
{
  "type": "Income",
  "amount": 0,
  "description": "Unable to process",
  "category": "Other"
}`,
      },
    ]);

    const text = response.response.text();
    // Parse JSON from response (may have extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw error;
  }
};

export const generateTextResponse = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};

export const analyzeMarketTrend = async (description) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `Based on this market transaction: "${description}", provide a brief market insight in one sentence.`;
    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch (error) {
    console.error("Error analyzing market trend:", error);
    throw error;
  }
};
