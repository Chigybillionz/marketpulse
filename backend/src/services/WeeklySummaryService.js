const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

// In-memory cache: one audio per user per period (period is derived from data,
// so identical data for the same user + period returns the cached audio instantly).
const summaryCache = new Map(); // `${userId}:${period}` -> { periodKey, script, audioBase64, mimeType, createdAt }
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24h hard expiry

/* ------------------------------- periods ------------------------------- */

const DAY_MS = 24 * 60 * 60 * 1000;

// Each supported summary period: how far back to look, the display label and
// natural phrasing used in the spoken script, and a key identifying the
// current bucket (used for caching and file names).
const PERIODS = {
  daily: {
    windowMs: 1 * DAY_MS,
    label: "Daily",
    noun: "today",
    scope: "Today",
    signoff: "See you tomorrow.",
    periodKey: (now) => {
      const d = new Date(now);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    },
  },
  weekly: {
    windowMs: 7 * DAY_MS,
    label: "Weekly",
    noun: "this week",
    scope: "This week",
    signoff: "See you next week.",
    periodKey: getWeekKey,
  },
  monthly: {
    windowMs: 30 * DAY_MS,
    label: "Monthly",
    noun: "this month",
    scope: "This month",
    signoff: "See you next month.",
    periodKey: (now) => {
      const d = new Date(now);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    },
  },
};

/* ----------------------------- helpers ----------------------------- */

function getWeekKey(now = new Date()) {
  // ISO week: Monday as first day
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = date.getUTCDay() || 7; // Sun -> 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${weekNo}`;
}

function naira(n) {
  return `\u20A6${Math.round(n).toLocaleString("en-NG")}`;
}

function spokenNaira(n) {
  return `${Math.round(n).toLocaleString("en-NG")} naira`;
}

/**
 * Aggregates transactions into the stats used by both the script and the UI.
 * `period` is one of "daily" | "weekly" | "monthly" and controls how far
 * back to look. Accepts raw Mongo docs or plain objects with
 * {type, amount, description, category, date}.
 */
function computeWeeklyStats(transactions, businessName = "your business", period = "weekly") {
  const config = PERIODS[period] || PERIODS.weekly;
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);

  const recent = (transactions || []).filter((t) => {
    const d = new Date(t.date || t.createdAt || Date.now());
    return d >= windowStart && d <= now;
  });

  // Strictly period-scoped: a daily summary only covers today, weekly only
  // this week, monthly only this month. When there is no data in the window,
  // stats are zeroed and the scripts/UI fall back to an encouraging message.
  const scope = recent;

  let moneyIn = 0;
  let moneyOut = 0;
  let incomeCount = 0;
  let expenseCount = 0;
  const byCategory = {};
  const byDescription = {};

  for (const t of scope) {
    const amount = Number(t.amount) || 0;
    const isIncome = t.type === "Income";
    if (isIncome) {
      moneyIn += amount;
      incomeCount += 1;
    } else {
      moneyOut += amount;
      expenseCount += 1;
    }
    const cat = t.category || "Other";
    byCategory[cat] = byCategory[cat] || { in: 0, out: 0 };
    if (isIncome) byCategory[cat].in += amount;
    else byCategory[cat].out += amount;

    const desc = (t.description || "transaction").trim();
    byDescription[desc] = (byDescription[desc] || 0) + amount;
  }

  const topMoving = Object.entries(byDescription).sort((a, b) => b[1] - a[1])[0];
  const topCategories = Object.entries(byCategory)
    .map(([name, v]) => ({ name, ...v, total: v.in + v.out }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  return {
    businessName,
    period,
    periodKey: config.periodKey(now),
    weekKey: getWeekKey(now), // legacy alias, kept for backward compatibility
    isSample: recent.length === 0,
    transactionCount: scope.length,
    moneyIn,
    moneyOut,
    net: moneyIn - moneyOut,
    balance: moneyIn - moneyOut,
    incomeCount,
    expenseCount,
    topMoving: topMoving ? { description: topMoving[0], total: topMoving[1] } : null,
    topCategories,
  };
}

/* --------------------------- script + audio --------------------------- */

async function generateScript(stats) {
  const { businessName, moneyIn, moneyOut, net, transactionCount, topMoving, topCategories } = stats;
  const config = PERIODS[stats.period] || PERIODS.weekly;

  if (!process.env.GEMINI_API_KEY && !process.env.AGENTROUTER_API_KEY) {
    throw new Error("API key not configured on server");
  }

  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
  });

  const prompt = `You are the voice of "MarketPulse", a friendly financial co-pilot for Nigerian market traders.
Write a short spoken ${config.label.toLowerCase()} business summary script for the trader.

Business: ${businessName}
Period: ${stats.periodKey}
${stats.isSample ? `NOTE: No transactions were recorded ${config.noun} yet. Acknowledge this warmly, encourage the trader to keep recording sales, and do NOT dwell on zero figures.` : ""}
Transactions recorded: ${transactionCount}
Money in: ${naira(moneyIn)} across ${stats.incomeCount} income entries
Money out: ${naira(moneyOut)} across ${stats.expenseCount} expense entries
Net position: ${naira(net)}
${topMoving ? `Top moving item: ${topMoving.description} with about ${naira(topMoving.total)} in activity` : `No single standout item ${config.noun}`}
${topCategories.length ? `Main categories: ${topCategories.map((c) => `${c.name} (${naira(c.total)})`).join(", ")}` : ""}

Rules:
- 120 to 180 words, plain conversational English a trader would enjoy hearing.
- Start with a warm one-line greeting that includes the business name.
- Refer to the period naturally (e.g. "${config.noun}").
- Mention money in, money out and the net position using words like "naira" (say figures naturally, never use symbols or digits with commas).
- Mention the top moving item if there is one.
- End with ONE short practical tip (stocking, pricing or saving). No sign-off, no music cues, no stage directions, no markdown.
- Output ONLY the script text.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  // Strip any accidental markdown or quotes around the script
  return text.replace(/^["']|["']$/g, "").replace(/[*_#`]/g, "");
}

// Fallback script if the text model is unavailable - the app must still speak.
function buildFallbackScript(stats) {
  const { businessName, moneyIn, moneyOut, net, topMoving, transactionCount } = stats;
  const config = PERIODS[stats.period] || PERIODS.weekly;

  if (transactionCount === 0) {
    return `Hello ${businessName}, here is your ${config.label.toLowerCase()} pulse. No sales or expenses were recorded ${config.noun} yet. The best way to grow is to record every transaction, big or small, as it happens. ${config.signoff}`;
  }

  const direction =
    net >= 0
      ? `You are up ${spokenNaira(Math.abs(net))} ${config.noun}. Great job keeping more than you spend.`
      : `You spent ${spokenNaira(Math.abs(net))} more than you took in ${config.noun}, so it is worth reviewing your biggest expenses.`;
  const topLine = topMoving
    ? `Your top moving item was ${topMoving.description}, bringing about ${spokenNaira(topMoving.total)} in activity.`
    : `Keep recording every sale so MarketPulse can spot your best performers.`;
  return `Hello ${businessName}, here is your ${config.label.toLowerCase()} pulse. ${config.scope} you took in ${spokenNaira(moneyIn)} and spent ${spokenNaira(moneyOut)}. ${direction} ${topLine} Small, steady records lead to big, steady profits. ${config.signoff}`;
}

/** Wraps raw 16-bit mono PCM in a RIFF/WAV container so browsers can play it. */
function pcmToWav(pcmBuffer, sampleRate = 24000, channels = 1) {
  const bitsPerSample = 16;
  const blockAlign = (channels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0, "ascii");
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write("WAVE", 8, "ascii");
  header.write("fmt ", 12, "ascii");
  header.writeUInt32LE(16, 16); // PCM chunk size
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36, "ascii");
  header.writeUInt32LE(pcmBuffer.length, 40);

  return Buffer.concat([header, pcmBuffer]);
}

/**
 * Generates TTS audio for a script using the Gemini API REST endpoint.
 * Returns { audioBase64 (WAV), mimeType } or null if TTS is unavailable.
 */
async function generateTtsAudio(script) {
  if (!process.env.GEMINI_API_KEY) return null;

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts";
  const voice = process.env.GEMINI_TTS_VOICE || "Kore";

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" +
        `${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Read this in a warm, clear, upbeat tone for a business owner: ${script}` }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("Gemini TTS request failed:", response.status, errText.slice(0, 300));
      return null;
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const inline = parts.map((p) => p.inlineData).find(Boolean);
    if (!inline?.data) {
      console.error("Gemini TTS response contained no audio data");
      return null;
    }

    // Gemini TTS returns raw 24kHz 16-bit mono PCM; wrap it in a WAV header.
    const pcm = Buffer.from(inline.data, "base64");
    const wav = pcmToWav(pcm, 24000, 1);
    return { audioBase64: wav.toString("base64"), mimeType: "audio/wav" };
  } catch (error) {
    console.error("Gemini TTS error:", error.message);
    return null;
  }
}

/* ------------------------------ public API ------------------------------ */

/**
 * Gets (or creates) the audio summary for a user for the requested period
 * ("daily" | "weekly" | "monthly").
 * Returns { script, audioBase64, mimeType, stats, ttsUsed }.
 * When TTS is unavailable, audioBase64 is null and the frontend falls back
 * to the browser's built-in speech synthesis using the returned script.
 */
async function getSummary(userId, transactions, businessName, period = "weekly") {
  const safePeriod = PERIODS[period] ? period : "weekly";
  const stats = computeWeeklyStats(transactions, businessName, safePeriod);

  const cacheKey = `${userId}:${safePeriod}`;
  const cached = summaryCache.get(cacheKey);
  const cacheValid =
    cached &&
    cached.periodKey === stats.periodKey &&
    cached.txCount === stats.transactionCount &&
    Date.now() - cached.createdAt < CACHE_MAX_AGE_MS;

  if (cacheValid) {
    return { ...cached.payload, stats: cached.stats, cached: true };
  }

  // 1) Script: Gemini, or deterministic fallback.
  let script;
  try {
    script = await generateScript(stats);
  } catch (error) {
    console.error(`${safePeriod} summary script generation failed, using fallback:`, error.message);
    script = buildFallbackScript(stats);
  }

  // 2) Audio: Gemini TTS if possible, otherwise null (frontend falls back
  //    to window.speechSynthesis).
  const tts = await generateTtsAudio(script);

  const payload = {
    script,
    audioBase64: tts ? tts.audioBase64 : null,
    mimeType: tts ? tts.mimeType : null,
    ttsUsed: Boolean(tts),
    period: safePeriod,
    durationHintSec: null, // frontend reads real duration from the audio element
  };

  summaryCache.set(cacheKey, {
    periodKey: stats.periodKey,
    txCount: stats.transactionCount,
    createdAt: Date.now(),
    stats,
    payload,
  });

  return { ...payload, stats, cached: false };
}

/** Backward-compatible alias: weekly summary. */
async function getWeeklySummary(userId, transactions, businessName) {
  return getSummary(userId, transactions, businessName, "weekly");
}

module.exports = {
  getSummary,
  getWeeklySummary,
  computeWeeklyStats,
  getWeekKey,
  pcmToWav,
};
