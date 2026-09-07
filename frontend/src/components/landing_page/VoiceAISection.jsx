import React, { useState, useRef } from 'react';
import { Mic, ArrowRight, ArrowUp, ArrowDown, Wallet, Sparkles, Headphones } from 'lucide-react';
import { VoiceRecorder } from '../../services/voiceRecorder';
import { transcribeAndAnalyze } from '../../services/geminiService';

export default function VoiceAISection({ onNavigate }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const recorderRef = useRef(null);
  const timeIntervalRef = useRef(null);

  const handleGetStarted = () => {
    if (onNavigate) {
      onNavigate("signup");
    } else {
      navigate("/signup");
    }
  };

  const navigate = window.navigate;

  const startRecording = async () => {
    setError(null);
    setResult(null);
    setRecordingTime(0);

    try {
      recorderRef.current = new VoiceRecorder();
      await recorderRef.current.startRecording();
      setIsRecording(true);

      // Start timer
      timeIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access.');
      console.error('Demo recording error:', err);
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;

    clearInterval(timeIntervalRef.current);

    try {
      setIsProcessing(true);
      const audioBlob = await recorderRef.current.stopRecording();
      const base64 = await recorderRef.current.audioToBase64(audioBlob);
      const result = await transcribeAndAnalyze(base64);
      setResult(result);
    } catch (err) {
      setError('Could not analyze audio. Please try again.');
      console.error('Demo recording error:', err);
    } finally {
      setIsRecording(false);
      setIsProcessing(false);
      recorderRef.current = null;
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const resetDemo = () => {
    setIsRecording(false);
    setIsProcessing(false);
    setResult(null);
    setError(null);
    setRecordingTime(0);
    recorderRef.current = null;
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section
      data-reveal="fade-up"
      className="bg-white py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Mic size={14} />
            Voice AI
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Just Speak.
            <br />
            <span className="text-[#064E3B]">We Handle the Rest.</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 font-medium max-w-2xl mx-auto">
            MarketPulse's voice AI understands natural Nigerian English, Pidgin, and market lingo.
            Say something like "I sold 3 bags of rice for 150k" and watch it become a structured transaction instantly.
          </p>
        </div>

        {/* Interactive Voice Demo */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Demo UI */}
          <div className="relative">
            {/* Demo Card */}
            <div className="bg-[#F9FAFB] rounded-3xl p-6 md:p-8 border border-gray-100 shadow-lg relative overflow-hidden">
              {/* Background decorative gradient */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-100/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-100/30 rounded-full blur-3xl" />

              <div className="relative z-10">
                {/* Microphone Button */}
                <div className="flex flex-col items-center justify-center py-8 md:py-12">
                  <button
                    onClick={toggleRecording}
                    disabled={isProcessing}
                    className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isRecording
                        ? 'bg-red-500 shadow-red-500/40 scale-110'
                        : isProcessing
                        ? 'bg-yellow-500 shadow-yellow-500/40'
                        : result
                        ? 'bg-green-500 shadow-green-500/40'
                        : 'bg-[#064E3B] shadow-green-900/30 hover:shadow-xl hover:shadow-green-900/40 hover:scale-105'
                    }`}
                  >
                    {/* Outer pulse rings when recording */}
                    {isRecording && (
                      <>
                        <div className="absolute inset-0 rounded-full border-2 border-red-200 animate-ping opacity-75" />
                        <div className="absolute inset-4 rounded-full border-2 border-red-300 animate-ping opacity-50" style={{ animationDelay: '100ms' }} />
                        <div className="absolute inset-8 rounded-full border-2 border-red-400 animate-ping opacity-30" style={{ animationDelay: '200ms' }} />
                      </>
                    )}

                    {isProcessing ? (
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-white border-t-transparent animate-spin" />
                    ) : isRecording ? (
                      <svg className="w-10 h-10 md:w-12 md:h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="10" y="4" width="4" height="12" rx="1" />
                        <rect x="16" y="4" width="4" height="12" rx="1" />
                      </svg>
                    ) : result ? (
                      <ArrowUp size={28} className="md:w-10 md:h-10" />
                    ) : (
                      <Mic size={28} className="md:w-10 md:h-10" />
                    )}
                  </button>

                  {/* Status text */}
                  <div className="mt-6 text-center">
                    {isRecording && (
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-sm font-semibold text-gray-700">Recording...</span>
                      </div>
                    )}
                    {isProcessing && (
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                        <span className="text-sm font-semibold text-gray-700">Analyzing...</span>
                      </div>
                    )}
                    {!isRecording && !isProcessing && !result && (
                      <span className="text-sm font-medium text-gray-500">
                        Tap the mic to try voice input
                      </span>
                    )}
                    {result && (
                      <span className="text-sm font-semibold text-green-600">
                        Transaction captured!
                      </span>
                    )}
                  </div>

                  {/* Recording timer */}
                  {isRecording && (
                    <div className="mt-4 px-4 py-2 bg-red-50 rounded-full border border-red-100">
                      <span className="text-xs font-mono font-bold text-red-600">
                        {formatTime(recordingTime)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Result Display */}
                {result && (
                  <div className="mt-6 bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          result.type === 'Expense'
                            ? 'bg-red-100 text-red-600'
                            : result.type === 'CREDIT'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-green-100 text-green-600'
                        }`}
                      >
                        {result.type === 'Expense' ? (
                          <ArrowDown size={24} />
                        ) : result.type === 'CREDIT' ? (
                          <Wallet size={24} />
                        ) : (
                          <ArrowUp size={24} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                          {result.type === 'CREDIT' ? 'Credit Sale' : result.type === 'Expense' ? 'Expense' : 'Income'}
                        </p>
                        <p className="text-base font-bold text-gray-900 truncate">
                          {result.description}
                        </p>
                        <p
                          className={`text-2xl md:text-3xl font-extrabold mt-2 ${
                            result.type === 'Expense'
                              ? 'text-red-600'
                              : result.type === 'CREDIT'
                              ? 'text-blue-600'
                              : 'text-green-600'
                          }`}
                        >
                          {result.type === 'Expense' ? '-' : '+'}
                          ₦{(result.amount || 0).toLocaleString()}
                        </p>
                        {result.category && (
                          <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                            {result.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="mt-6 bg-red-50 rounded-2xl p-4 md:p-5 border border-red-100">
                    <p className="text-sm font-semibold text-red-600 text-center">
                      {error}
                    </p>
                    <button
                      onClick={resetDemo}
                      className="mt-3 text-xs font-semibold text-red-700 hover:text-red-800 underline"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {/* Try it hint */}
                {!result && !isRecording && !isProcessing && !error && (
                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400 font-medium">
                      Try saying: <span className="text-gray-600">"I sold 5 bags of garri for 100k"</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right - How it works */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              How Voice AI Works
            </h3>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#064E3B] text-white flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Speak Naturally</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Tap the microphone and say your transaction in plain language.
                    Use your native market lingo — no special format required.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#064E3B] text-white flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">AI Understands Context</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Our AI extracts the amount, item, category, and even credit details
                    from your natural speech.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#064E3B] text-white flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Instant Structured Data</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Your transaction is logged, categorized, and ready for reporting.
                    No typing, no spreadsheets.
                  </p>
                </div>
              </div>
            </div>

            {/* Supported examples */}
            <div className="bg-[#F9FAFB] rounded-2xl p-5 border border-gray-100 mt-8">
              <h4 className="font-bold text-gray-900 mb-3">Try saying:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-gray-400">•</span>
                  "Paid 5k for transport to Lagos"
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-gray-400">•</span>
                  "Sold 3 cartons of Indomie for 15k"
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-gray-400">•</span>
                  "Chinedu owes me 20k from last week"
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-gray-400">•</span>
                  "Bought 50k worth of clothes from Balogun"
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleGetStarted}
              className="w-full bg-[#064E3B] text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#043d2e] transition-colors shadow-lg shadow-green-900/20 hover:shadow-xl hover:shadow-green-900/30"
            >
              Start Using Voice AI
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
