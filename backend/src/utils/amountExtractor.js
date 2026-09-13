/**
 * Amount Extractor for Nigerian Commerce
 * Extracts monetary amounts from English, Nigerian Pidgin, spoken number words,
 * abbreviations (5k, 10k), currency symbols (₦), and local language markers.
 */

const NUMBER_WORDS = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
  thousand: 1000,
  million: 1000000,
  // Nigerian Pidgin / Slang
  k: 1000,
  m: 1000000,
  // Hausa number words
  daya: 1,
  biyu: 2,
  uku: 3,
  hudu: 4,
  biyar: 5,
  shida: 6,
  bakwai: 7,
  takwas: 8,
  tara: 9,
  goma: 10,
  dari: 100,
  dubu: 1000,
  miliyan: 1000000,
  // Yoruba number words
  okan: 1,
  meji: 2,
  meta: 3,
  merin: 4,
  marun: 5,
  mefa: 6,
  meje: 7,
  mejo: 8,
  mesan: 9,
  mewa: 10,
  ogorun: 100,
  egberun: 1000,
  // Igbo number words
  otu: 1,
  abuo: 2,
  ato: 3,
  ano: 4,
  ise: 5,
  isii: 6,
  asaa: 7,
  asato: 8,
  itolu: 9,
  iri: 10,
  nari: 100,
  puku: 1000,
};

/**
 * Converts spoken English phrase (e.g. "twenty five thousand five hundred") to a number.
 */
function wordsToNumber(wordsStr) {
  const words = wordsStr.toLowerCase().replace(/[-]/g, ' ').split(/\s+/).filter(Boolean);
  let total = 0;
  let current = 0;

  for (const word of words) {
    if (word === 'and') continue;
    const val = NUMBER_WORDS[word];
    if (val === undefined) return null;

    if (val === 1000000) {
      current = current === 0 ? 1 : current;
      total += current * 1000000;
      current = 0;
    } else if (val === 1000) {
      current = current === 0 ? 1 : current;
      total += current * 1000;
      current = 0;
    } else if (val === 100) {
      current = current === 0 ? 1 : current;
      current *= 100;
    } else {
      current += val;
    }
  }

  return total + current;
}

const NUMBER_WORD_LIST = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
  'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy',
  'eighty', 'ninety', 'hundred', 'thousand', 'million', 'and'
].join('|');

const SPOKEN_PHRASE_REGEX = new RegExp(`\\b((?:(?:${NUMBER_WORD_LIST})\\s*)+)(?:\\s*(?:naira|kobo|cash))?\\b`, 'gi');

/**
 * Primary extractor function.
 * Evaluates transcript and extracts numeric or spoken amounts.
 * @param {string} text - Spoken transcript
 * @returns {{ amount: number, raw: string } | null}
 */
function extractAmountFromTranscript(text) {
  if (!text || typeof text !== 'string') return null;

  const clean = text.trim().toLowerCase();

  // Pattern 1: Pidgin abbreviations like "5k", "10k", "15.5k", "1.5m", "na 10k", "20k"
  const kAbbrevMatch = /\b(\d+(?:\.\d+)?)\s*(k|m)\b/i.exec(clean);
  if (kAbbrevMatch) {
    const num = parseFloat(kAbbrevMatch[1]);
    const multiplier = kAbbrevMatch[2].toLowerCase() === 'm' ? 1000000 : 1000;
    return {
      amount: Math.round(num * multiplier),
      raw: kAbbrevMatch[0]
    };
  }

  // Pattern 2: Spoken words with 'k' e.g. "five k", "ten k", "twenty k"
  const wordKMatch = /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|forty|fifty|hundred)\s*k\b/i.exec(clean);
  if (wordKMatch) {
    const val = NUMBER_WORDS[wordKMatch[1]];
    if (val) {
      return {
        amount: val * 1000,
        raw: wordKMatch[0]
      };
    }
  }

  // Pattern 3: Hausa patterns like "dubu biyar" (5,000), "dubu goma" (10,000), "dubu biyu" (2,000)
  const hausaDubuMatch = /\bdubu\s+(daya|biyu|uku|hudu|biyar|shida|bakwai|takwas|tara|goma)\b/i.exec(clean);
  if (hausaDubuMatch) {
    const multiplier = NUMBER_WORDS[hausaDubuMatch[1]] || 1;
    return {
      amount: multiplier * 1000,
      raw: hausaDubuMatch[0]
    };
  }

  // Pattern 4: Yoruba patterns like "egberun marun" (5,000), "egberun meji" (2,000)
  const yorubaEgberunMatch = /\begberun\s+(okan|meji|meta|merin|marun|mefa|meje|mejo|mesan|mewa)\b/i.exec(clean);
  if (yorubaEgberunMatch) {
    const multiplier = NUMBER_WORDS[yorubaEgberunMatch[1]] || 1;
    return {
      amount: multiplier * 1000,
      raw: yorubaEgberunMatch[0]
    };
  }

  // Pattern 5: Igbo patterns like "puku ise" (5,000), "puku abuo" (2,000)
  const igboPukuMatch = /\bpuku\s+(otu|abuo|ato|ano|ise|isii|asaa|asato|itolu|iri)\b/i.exec(clean);
  if (igboPukuMatch) {
    const multiplier = NUMBER_WORDS[igboPukuMatch[1]] || 1;
    return {
      amount: multiplier * 1000,
      raw: igboPukuMatch[0]
    };
  }

  // Pattern 6: Spoken English phrases e.g. "five thousand naira", "twenty thousand", "seven thousand five hundred", "two million", "ten thousand"
  SPOKEN_PHRASE_REGEX.lastIndex = 0;
  let phraseMatch;
  while ((phraseMatch = SPOKEN_PHRASE_REGEX.exec(clean)) !== null) {
    const candidate = phraseMatch[1].trim();
    // Only accept if it contains a scale word or is multi-word number
    if (/(thousand|hundred|million|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)/.test(candidate)) {
      const parsed = wordsToNumber(candidate);
      if (parsed && parsed > 0) {
        return {
          amount: parsed,
          raw: candidate
        };
      }
    }
  }

  // Pattern 7: Any explicit digits found with currency marker or context e.g. "₦5000", "for 5000", "5000 naira", "worth 30000"
  const digitsWithContext = /(?:[₦#]|for|worth|na|is|cost|amount|of)\s*(\d{1,3}(?:,\d{3})+|\d+)/i.exec(clean);
  if (digitsWithContext) {
    const val = parseInt(digitsWithContext[1].replace(/,/g, ''), 10);
    if (!isNaN(val) && val > 0) {
      return {
        amount: val,
        raw: digitsWithContext[0]
      };
    }
  }

  // Pattern 8: Plain digits followed by "naira" or stand-alone digits
  const plainDigitNaira = /(\d{1,3}(?:,\d{3})+|\d+)\s*(?:naira)/i.exec(clean);
  if (plainDigitNaira) {
    const val = parseInt(plainDigitNaira[1].replace(/,/g, ''), 10);
    if (!isNaN(val) && val > 0) {
      return {
        amount: val,
        raw: plainDigitNaira[0]
      };
    }
  }

  // Fallback: standalone significant digit (>= 50 to avoid small counts like "2 bags")
  const looseDigits = /\b(\d{2,10})\b/g;
  let match;
  while ((match = looseDigits.exec(clean)) !== null) {
    const val = parseInt(match[1], 10);
    if (val >= 50) {
      return {
        amount: val,
        raw: match[0]
      };
    }
  }

  return null;
}

module.exports = {
  extractAmountFromTranscript,
  wordsToNumber
};
