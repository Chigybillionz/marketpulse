const crypto = require("crypto");
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getSummary } = require("../services/WeeklySummaryService");
const Transaction = require("../models/Transaction");
const WelcomeUser = require("../models/WelcomeUser");
const { extractAmountFromTranscript } = require("../utils/amountExtractor");

// Initialize with the environment variable from backend, explicitly defining the base URL
// to avoid routing to broken internal proxies like daily-cloudcode-pa
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.AGENTROUTER_API_KEY || ""
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
  return genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: {
      temperature: 0.1
    }
  });
}

function buildAnalysisPrompt() {
  return `You are analyzing audio spoken by a Nigerian market merchant or trader.
The merchant may speak Nigerian English, Nigerian Pidgin, Yoruba, Hausa, or Igbo.

CRITICAL INSTRUCTION: If the audio is empty, silent, contains only background noise, or contains NO spoken words whatsoever, you MUST respond immediately with:
{
  "transcript": "",
  "type": "UNKNOWN_AMOUNT",
  "amount": 0,
  "description": "No speech detected",
  "category": "Other"
}

Extract the speech and transaction details and respond ONLY with valid JSON (no markdown formatting, no code fences):
{
  "transcript": "Exact or best transcription of what the merchant said",
  "type": "Income",
  "amount": 15000,
  "description": "Sold 2 bags of garri",
  "category": "Dry Goods"
}

If the transaction is a credit sale (e.g. "I gave Ibrahim 2 cartons of Indomie on credit, he will pay on Friday" or "Customer owe me 5k"), the JSON MUST look like this:
{
  "transcript": "Customer owe me five thousand",
  "type": "CREDIT",
  "amount": 5000,
  "description": "Customer debt",
  "category": "Other",
  "creditDetails": {
    "customerName": "Customer",
    "dueDate": null
  }
}

Rules:
- transcript: Mandatory. Provide the exact or closest phonetic words spoken in English, Pidgin, Yoruba, Hausa, or Igbo.
- type: Must be "Income", "Expense", "CREDIT", or "UNKNOWN_AMOUNT".
  - Use "Income" for sales, goods sold, money received, revenue.
  - Use "Expense" for purchases, supplies, transport, fuel, bills.
  - Use "CREDIT" if a customer owes money, bought on credit, or will pay later.
  - Use "UNKNOWN_AMOUNT" if no monetary amount or trade price was spoken.
- amount: IMPORTANT: Return a strict integer number (e.g. 5000, 10000). Convert spoken words ("five thousand", "ten thousand", "two million", "dubu biyar", "egberun marun", "puku ise"), abbreviations ("5k", "10k", "20k"), and currency mentions ("₦5000", "5000 naira") into numbers. If no amount was mentioned, set amount to 0 and type to "UNKNOWN_AMOUNT".
- description: Brief summary of what was bought/sold/owed.
- category: One of ["Dry Goods", "Grains", "Produce", "Textiles", "Electronics", "Transport", "Utilities", "Other"].
- creditDetails: ONLY include this if type is "CREDIT". Include customerName and dueDate (in YYYY-MM-DD if mentioned, otherwise null).

Examples of Nigerian Expressions:
- "I sold items for 5000" -> transcript: "I sold items for 5000", amount: 5000, type: "Income"
- "Five thousand naira" -> transcript: "Five thousand naira", amount: 5000, type: "Income"
- "Customer bought goods worth ten thousand" -> transcript: "Customer bought goods worth ten thousand", amount: 10000, type: "Income"
- "I sell am five k" -> transcript: "I sell am five k", amount: 5000, type: "Income"
- "Customer owe me two thousand" -> transcript: "Customer owe me two thousand", amount: 2000, type: "CREDIT"
- "Na 10k" -> transcript: "Na 10k", amount: 10000, type: "Income"
- "Chidinma bought something" -> transcript: "Chidinma bought something", amount: 0, type: "UNKNOWN_AMOUNT", description: "bought something"
- "Mo ta aso ni egberun marun" -> transcript: "Mo ta aso ni egberun marun", amount: 5000, type: "Income", description: "aso (cloth)"
- "Na sayar da shinkafa dubu biyar" -> transcript: "Na sayar da shinkafa dubu biyar", amount: 5000, type: "Income", description: "shinkafa (rice)"
- "E rere m akwa puku ise" -> transcript: "E rere m akwa puku ise", amount: 5000, type: "Income", description: "akwa (cloth)"`;
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
  const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || "gemini-flash-latest";

  const candidateModels = [primaryModel, fallbackModel, "gemini-3.5-flash", "gemini-3.7-flash"];
  const models = candidateModels.filter((v, i, a) => v && a.indexOf(v) === i);

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

      const isTransientNetwork = !status || error.message?.includes("fetch failed") || error.message?.includes("ECONNRESET") || error.message?.includes("ETIMEDOUT") || error.message?.includes("socket");

      if (isTransientNetwork || status === 503 || status === 500) {
        console.warn(`Network/transient error on model ${models[i]} (${error.message}). Retrying...`);
        await new Promise((r) => setTimeout(r, 1000));
        try {
          const retryModel = makeModel(models[i]);
          return await retryModel.generateContent(promptParts);
        } catch (retryErr) {
          console.warn(`Retry on model ${models[i]} failed: ${retryErr.message}`);
          if (i < models.length - 1) continue;
        }
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
      const parsed = JSON.parse(jsonMatch[0]);

      // Normalize data fields
      const result = {
        transcript: (parsed.transcript || "").trim(),
        type: parsed.type || "Income",
        amount: typeof parsed.amount === "number" ? parsed.amount : (parseInt(parsed.amount, 10) || 0),
        description: parsed.description || "Voice trade entry",
        category: parsed.category || "Other",
        creditDetails: parsed.creditDetails || null,
        detectedAmountRaw: parsed.detectedAmountRaw || null,
      };

      // Fallback deterministic amount extraction if amount was not extracted or is 0
      if ((result.amount === 0 || result.type === "UNKNOWN_AMOUNT") && result.transcript) {
        const extracted = extractAmountFromTranscript(result.transcript);
        if (extracted && extracted.amount > 0) {
          result.amount = extracted.amount;
          result.detectedAmountRaw = extracted.raw;
          if (result.type === "UNKNOWN_AMOUNT") {
            result.type = "Income";
          }
        }
      }

      // If amount is 0 and no amount detected
      if (result.amount === 0) {
        result.type = "UNKNOWN_AMOUNT";
      }

      return result;
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

    console.error("Error in AI Controller:", {
      status: statusCode,
      message: error.message,
      retryAfterSec: retryAfter || undefined,
    });

    // If an upstream network or temporary server issue occurred, return a graceful 200
    // fallback with UNKNOWN_AMOUNT so the merchant sees the options to re-record or enter manually.
    if (error.message?.includes("fetch failed") || statusCode === 503 || statusCode === 500) {
      return res.status(200).json({
        transcript: "",
        type: "UNKNOWN_AMOUNT",
        amount: 0,
        description: "Speech analysis temporarily unavailable",
        category: "Other",
        aiError: error.message || "Network issue"
      });
    }

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
