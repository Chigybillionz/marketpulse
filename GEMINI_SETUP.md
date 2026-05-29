# Gemini API Voice Integration Setup Guide

## Overview

This guide will help you integrate Google's Gemini API for voice-to-text and AI confirmation functionality in MarketPulse.

## Prerequisites

- Google Cloud Account
- Node.js 16+ installed
- npm/yarn package manager

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Name: "MarketPulse AI"
4. Click "Create"
5. Wait for project creation (2-3 minutes)

## Step 2: Enable Gemini API

1. In Google Cloud Console, search for "Generative Language API"
2. Click on it and press "Enable"
3. Wait for it to be enabled

## Step 3: Create API Key

1. Go to **Credentials** (in left sidebar)
2. Click **"+ Create Credentials"** → **"API Key"**
3. Copy your API key (you'll use this in your environment variables)
4. Click "Restrict key" and select:
   - API restrictions: Generative Language API
   - Application restrictions: HTTP referrers (Web)
   - Add referrer: `localhost:3000/*` and your Vercel domain

## Step 4: Install Required Packages

```bash
cd frontend
npm install @google/generative-ai dotenv
```

## Step 5: Set Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_APP_NAME=MarketPulse AI
VITE_API_URL=http://localhost:3000
```

**For Production (Vercel):**
Add these in Vercel Dashboard → Settings → Environment Variables

## Step 6: Create Voice Service File

Create `frontend/src/services/geminiService.js`:

```javascript
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
        text: `Analyze this audio recording for a market trader. Extract:
1. Transaction type (Income/Expense)
2. Amount in Nigerian Naira
3. Description/items sold
4. Category

Respond in JSON format:
{
  "type": "Income" or "Expense",
  "amount": number,
  "description": string,
  "category": string
}`,
      },
    ]);

    const text = response.response.text();
    return JSON.parse(text);
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
```

## Step 7: Create Voice Recorder Component

Create `frontend/src/services/voiceRecorder.js`:

```javascript
export class VoiceRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
  }

  async startRecording() {
    try {
      this.audioChunks = [];
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
      console.log("Recording started...");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      throw error;
    }
  }

  stopRecording() {
    return new Promise((resolve) => {
      if (this.mediaRecorder) {
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
          this.stopMediaStream();
          resolve(audioBlob);
        };
        this.mediaRecorder.stop();
      }
    });
  }

  stopMediaStream() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }

  async audioToBase64(audioBlob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });
  }
}
```

## Step 8: Update listeng.jsx Component

The component should use the VoiceRecorder and Gemini services:

```javascript
import { VoiceRecorder } from "../services/voiceRecorder";
import { transcribeAndAnalyze } from "../services/geminiService";

// In your component:
const [isRecording, setIsRecording] = useState(false);
const recorderRef = useRef(new VoiceRecorder());

const handleStartRecording = async () => {
  try {
    setIsRecording(true);
    await recorderRef.current.startRecording();
  } catch (error) {
    console.error("Failed to start recording:", error);
    setIsRecording(false);
  }
};

const handleStopRecording = async () => {
  try {
    setIsRecording(false);
    const audioBlob = await recorderRef.current.stopRecording();
    const base64 = await recorderRef.current.audioToBase64(audioBlob);

    // Send to Gemini API
    const analysis = await transcribeAndAnalyze(base64, "audio/wav");

    // Pass to confirmation screen
    onNavigate("ai_confirmation");
  } catch (error) {
    console.error("Failed to process audio:", error);
  }
};
```

## Troubleshooting

### Issue: "API key not found"

**Solution:** Check `.env.local` exists and VITE_GEMINI_API_KEY is set correctly

### Issue: "Microphone permission denied"

**Solution:** Allow microphone access when browser asks, or check browser permissions

### Issue: "Invalid audio format"

**Solution:** Ensure audio is recorded as WAV or MP3 format with proper MIME type

### Issue: "Quota exceeded"

**Solution:** Check Google Cloud billing and ensure API quota is set

## Cost Estimation

- Gemini API: ~$0.001-$0.002 per request
- ~200-500 requests/month for typical usage
- Expected monthly cost: $0.20-$1.00

---

For more info: https://ai.google.dev/tutorials/rest_quickstart
