const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI("AQ.Ab8RN6JscwcIbSnfKZmkpvb2HQU3q67LsIVnKWQqp-w6dv6N5w");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    console.log("Testing text generation...");
    const response = await model.generateContent("Hello, are you working?");
    console.log("Text response:", response.response.text());
  } catch (err) {
    console.error("Gemini Test Failed:", err);
  }
}

testGemini();
