import apiClient from './api';

/**
 * Fetches the pulse audio summary for the logged-in user for a period.
 * period: "daily" | "weekly" | "monthly" (defaults to "weekly").
 * Returns { script, audioBase64, mimeType, ttsUsed, stats }.
 * audioBase64 is null when server-side TTS is unavailable — the caller
 * should fall back to the browser's speechSynthesis with `script`.
 */
export const getSummary = (period = "weekly") => {
  return apiClient(`/ai/summary?period=${period}`, { method: "GET" });
};

/** Backward-compatible alias for the weekly summary. */
export const getWeeklySummary = async () => {
  return getSummary("weekly");
};

export const transcribeAndAnalyze = async (
  audioBase64,
  mimeType = "audio/webm",
) => {
  // Use the centralized apiClient which handles auth tokens and API URL
  return apiClient('/ai/analyze-voice', {
    method: 'POST',
    body: JSON.stringify({ audioBase64, mimeType }),
  });
};

export const generateTextResponse = async (prompt) => {
  try {
    // Phase 3 note: moved to backend, this function isn't used by the app yet.
    // If needed in the future, create a backend endpoint for text completion.
    console.warn("generateTextResponse is deprecated in frontend");
    return "Not implemented on backend yet.";
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};

export const analyzeMarketTrend = async (description) => {
  try {
    console.warn("analyzeMarketTrend is deprecated in frontend");
    return "Not implemented on backend yet.";
  } catch (error) {
    console.error("Error analyzing market trend:", error);
    throw error;
  }
};
