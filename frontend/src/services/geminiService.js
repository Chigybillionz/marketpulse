import apiClient from './api';

/**
 * Fetches the weekly pulse audio summary for the logged-in user.
 * Returns { script, audioBase64, mimeType, ttsUsed, stats }.
 * audioBase64 is null when server-side TTS is unavailable — the caller
 * should fall back to the browser's speechSynthesis with `script`.
 */
export const getWeeklySummary = async () => {
  return apiClient('/ai/weekly-summary', { method: 'GET' });
};

export const transcribeAndAnalyze = async (
  audioBase64,
  mimeType = "audio/webm",
) => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";
    const response = await fetch(`${backendUrl}/ai/analyze-voice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audioBase64, mimeType }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error transcribing audio via backend:", error);
    throw error;
  }
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
