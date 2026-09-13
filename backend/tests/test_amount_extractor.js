const { extractAmountFromTranscript } = require('../src/utils/amountExtractor');

const testCases = [
  { input: "I sold items for 5000", expected: 5000 },
  { input: "Five thousand naira", expected: 5000 },
  { input: "Customer bought goods worth ten thousand", expected: 10000 },
  { input: "I sell am five k", expected: 5000 },
  { input: "Customer owe me two thousand", expected: 2000 },
  { input: "Na 10k", expected: 10000 },
  { input: "I collect 20k from customer", expected: 20000 },
  { input: "₦5000 for 2 tubers of yam", expected: 5000 },
  { input: "5000 naira", expected: 5000 },
  { input: "Sold 3 bags for seven thousand five hundred naira", expected: 7500 },
  { input: "Na dubu goma", expected: 10000 },
  { input: "Mo ta aso ni egberun marun", expected: 5000 },
  { input: "E rere m akwa puku ise", expected: 5000 },
  { input: "Chidinma bought something", expected: null }
];

let failed = 0;
console.log("=== Testing Amount Extractor ===");
for (const tc of testCases) {
  const res = extractAmountFromTranscript(tc.input);
  const amount = res ? res.amount : null;
  const pass = amount === tc.expected;
  if (pass) {
    console.log(`[PASS] "${tc.input}" => ${amount}`);
  } else {
    console.error(`[FAIL] "${tc.input}" => Expected: ${tc.expected}, Got: ${amount}`);
    failed++;
  }
}

if (failed === 0) {
  console.log("=== ALL TEST CASES PASSED ===");
} else {
  console.error(`=== ${failed} TESTS FAILED ===`);
  process.exit(1);
}
