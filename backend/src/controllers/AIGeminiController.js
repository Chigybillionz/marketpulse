const crypto = require("crypto");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getSummary } = require("../services/WeeklySummaryService");
const Transaction = require("../models/Transaction");
const WelcomeUser = require("../models/WelcomeUser");

// Initialize with the environment variable from backend, explicitly defining the base URL
// to avoid routing to broken internal proxies like daily-cloudcode-pa
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.AGENTROUTER_API_KEY || "",
  { baseUrl: "https://generativelanguage.googleapis.com" }
);

/* ------------------------- quota protection layer -------------------------
 * The Gemini free tier allows very few requests/day per model (e.g. 20 RPD
 * for gemini-3.6-flash). To keep the voice endpoint usable:
 *  - identical audio payloads are served from an in-memory cache
 *  - concurrent duplicate requests are collapsed into one Gemini call
 *  - a token-bucket limiter spaces requests out and rejects early with 429
 *    instead of letting every call burn a quota request
 *  - when a 429 comes back, its Retry-After delay is honored and surfaced
 *    to the client as a clear, structured error
 * ------------------------------------------------------------------------- */

const CACHE_MAX_ENTRIES = 50;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const analysisCache = new Map(); // payloadHash -> { data, createdAt }
const inFlightRequests = new Map(); // payloadHash -> Promise<analysis>

// Simple sliding-window limiter: max N Gemini calls per minute per process.
const MAX_CALLS_PER_MINUTE = parseInt(process.env.GEMINI_MAX_RPM || "10", 10);
const recentCallTimestamps = [];

// Second-boundary short cooldown after a 429, so we stop hammering a model
// that has told us to back off.
let cooldownUntilMs = 0;

function isCooldownActive() {
  return Date.now() < cooldownUntilMs;
}

function startCooldown(ms) {
  const until = Date.now() + Math.max(ms, 0);
  if (until > cooldownUntilMs) cooldownUntilMs = until;
}

/** Sliding-window RPM gate; returns false when the caller should wait. */
function tryConsumeRateSlot() {
  const now = Date.now();
  while (recentCallTimestamps.length && now - recentCallTimestamps[0] > 60_000) {
    recentCallTimestamps.shift();
  }
  if (recentCallTimestamps.length >= MAX_CALLS_PER_MINUTE) return false;
  recentCallTimestamps.push(now);
  return true;
}

/** SHA-256 of the request payload, used as the cache/dedup key. */
function hashPayload(audioBase64, mimeType) {
  return crypto.createHash("sha256").update(`${mimeType}:${audioBase64}`).digest("hex");
}

function makeModel(modelName) {
  return genAI.getGenerativeModel({ model: modelName });
}

function buildAnalysisPrompt() {
  return `You are analyzing audio from a Nigerian market trader. Extract the transaction details from this audio recording.

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
}`;
}

/** Build a compact, structured error the frontend can reason about. */
function quotaError(statusCode, message, retryAfterSec) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.retryAfterSec = retryAfterSec;
  return error;
}

function extractRetryAfterSec(error) {
  const status = error?.status || error?.code;
  if (status !== 429) return null;

  // 1) errorDetails[].retryDelay ("45.467s") from Google's structured errors
  const details = error?.errorDetails;
  if (Array.isArray(details)) {
    const retryInfo = details.find((d) => d["@type"]?.includes("RetryInfo"));
    if (retryInfo?.retryDelay) {
      const sec = parseFloat(retryInfo.retryDelay);
      if (!Number.isNaN(sec) && sec > 0) return Math.ceil(sec);
    }
  }

  // 2) Plain-text "Please retry in 45.467s." in the message
  const msgMatch = /retry in\s+([\d.]+)s/i.exec(error?.message || "");
  if (msgMatch) return Math.ceil(parseFloat(msgMatch[1]));

  // 3) Default: retry after 60s
  return 60;
}

/**
 * Calls Gemini with retry-after-aware handling of 429s and one automatic
 * retry, falling back to the daily-quota fallback model when the primary
 * model is exhausted.
 */
async function generateWithQuotaHandling(promptParts) {
  if (isCooldownActive()) {
    const retryAfterSec = Math.ceil((cooldownUntilMs - Date.now()) / 1000);
    throw quotaError(
      429,
      `AI service is cooling down after rate limit. Try again in ${retryAfterSec}s.`,
      retryAfterSec
    );
  }

  if (!tryConsumeRateSlot()) {
    throw quotaError(429, "Too many AI requests right now. Please wait a moment and try again.", 10);
  }

  const primaryModel = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || null;

  const models = fallbackModel ? [primaryModel, fallbackModel] : [primaryModel];

  for (let i = 0; i < models.length; i += 1) {
    try {
      const model = makeModel(models[i]);
      // eslint-disable-next-line no-await-in-loop
      const response = await model.generateContent(promptParts);
      return response;
    } catch (error) {
      const status = error?.status || error?.code;

      if (status === 429) {
        const retryAfterSec = extractRetryAfterSec(error);

        // If we have another model to try, switch silently and keep going.
        if (i < models.length - 1) {
          startCooldown(Math.min(retryAfterSec, 15) * 1000);
          // eslint-disable-next-line no-await-in-loop
          continue;
        }

        // Last model failed: enter a full cooldown and surface the wait.
        startCooldown(Math.min(retryAfterSec, 120) * 1000);
        throw quotaError(
          429,
          `AI daily quota reached. Please retry in about ${retryAfterSec}s.`,
          retryAfterSec
        );
      }

      if (status === 503 || status === 500) {
        // Transient upstream error: retry once after a short pause.
        if (i < models.length - 1) continue;
        throw quotaError(503, "AI service is temporarily unavailable. Please try again shortly.", 5);
      }

      throw error;
    }
  }

  throw quotaError(500, "AI request failed unexpectedly.", 0);
}

const transcribeAndAnalyze = async (req, res) => {
  try {
    const { audioBase64, mimeType = "audio/webm" } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: "Missing audioBase64" });
    }

    if (!process.env.GEMINI_API_KEY && !process.env.AGENTROUTER_API_KEY) {
      return res.status(500).json({ error: "API key not configured on server" });
    }

    const payloadHash = hashPayload(audioBase64, mimeType);
    const now = Date.now();

    // 1) Cache hit: identical audio analyzed recently → serve instantly, no quota spent.
    const cached = analysisCache.get(payloadHash);
    if (cached && now - cached.createdAt < CACHE_TTL_MS) {
      return res.status(200).json({ ...cached.data, cached: true });
    }
    if (cached) analysisCache.delete(payloadHash);

    // 2) Same audio already in-flight (double-click / StrictMode double render)
    //    → piggyback on that single Gemini call instead of issuing a second one.
    const inFlight = inFlightRequests.get(payloadHash);
    if (inFlight) {
      const data = await inFlight;
      return res.status(200).json({ ...data, cached: false });
    }

    const prompt = buildAnalysisPrompt();

    const analysisPromise = (async () => {
      const response = await generateWithQuotaHandling([
        { inlineData: { data: audioBase64, mimeType } },
        { text: prompt },
      ]);
      const text = response.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in AI response");
      return JSON.parse(jsonMatch[0]);
    })();

    inFlightRequests.set(payloadHash, analysisPromise);

    let data;
    try {
      data = await analysisPromise;
    } finally {
      inFlightRequests.delete(payloadHash);
    }

    // Only cache successful, parseable results.
    analysisCache.set(payloadHash, { data, createdAt: Date.now() });
    if (analysisCache.size > CACHE_MAX_ENTRIES) {
      const oldestKey = analysisCache.keys().next().value;
      analysisCache.delete(oldestKey);
    }

    return res.status(200).json(data);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const retryAfter = error.retryAfterSec || null;

    // structured log without dumping the whole error object
    console.error("Error in AI Controller:", {
      status: statusCode,
      message: error.message,
      retryAfterSec: retryAfter || undefined,
    });

    return res.status(statusCode).json({
      error: error.message || "Failed to analyze audio",
      retryAfterSec: retryAfter || undefined,
    });
  }
};

/**
 * GET /api/ai/summary?period=daily|weekly|monthly
 * GET /api/ai/weekly-summary (legacy alias, defaults to weekly)
 * Protected: builds an audio summary (script + TTS audio) from the
 * logged-in user's transactions for the requested period.
 */
const getSummaryAudio = async (req, res) => {
  try {
    const period = ["daily", "weekly", "monthly"].includes(req.query.period)
      ? req.query.period
      : "weekly";

    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(300)
      .lean();

    const user = await WelcomeUser.findById(req.user.id).lean();
    const businessName = user?.businessName || "your business";

    const summary = await getSummary(req.user.id, transactions, businessName, period);
    return res.status(200).json(summary);
  } catch (error) {
    console.error("Error in summary controller:", error);
    return res.status(500).json({ error: error.message || "Failed to build summary" });
  }
};

module.exports = {
  transcribeAndAnalyze,
  getSummaryAudio,
};
