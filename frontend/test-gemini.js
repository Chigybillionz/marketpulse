import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

function parseEnv() {
  const content = fs.readFileSync(".env.local", "utf-8");
  const env = {};
  content.split("\n").forEach(line => {
    const [key, ...vals] = line.split("=");
    if (key) env[key.trim()] = vals.join("=").trim();
  });
  return env;
}

async function test() {
  const env = parseEnv();
  // Don't pass the key to constructor if we pass it via Bearer
  const genAI = new GoogleGenerativeAI("dummy-key");
  
  try {
    const model = genAI.getGenerativeModel(
      { model: "gemini-3.6-flash" },
      { customHeaders: { Authorization: "Bearer " + env.VITE_GEMINI_API_KEY } } 
    );

    const response = await model.generateContent([
      {
        inlineData: {
          data: "UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==",
          mimeType: "audio/webm",
        },
      },
      {
        text: "Say hello world"
      },
    ]);

    console.log("Success:", response.response.text());
  } catch(e) {
    console.error("Error:", e);
  }
}
test();
