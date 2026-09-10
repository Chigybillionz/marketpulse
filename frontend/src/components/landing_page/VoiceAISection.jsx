/**
 * VoiceAISection — interactive voice demo (Phase 2 visual upgrade).
 *
 * The functional flow is untouched: real VoiceRecorder capture and the
 * real `transcribeAndAnalyze` Gemini call. Only the presentation is
 * cinematic — an animated waveform while listening, a staged
 * PROCESSING → ANALYZING presentation while the single real API call
 * runs, and an elegant result reveal.
 */

import { useEffect, useRef, useState } from 'react';
import { Mic, ArrowRight, ArrowUp, ArrowDown, Wallet } from 'lucide-react';
import { VoiceRecorder } from '../../services/voiceRecorder';
import { transcribeAndAnalyze } from '../../services/geminiService';
import { VoiceWaveform } from './motionPrimitives';
import { useLanguage } from '../../i18n/LanguageContext';

const MP_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function VoiceAISection({ onNavigate }) {
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false); // presentation stage of the real call
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const recorderRef = useRef(null);
  const timeIntervalRef = useRef(null);
  const analyzeTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(timeIntervalRef.current);
      clearTimeout(analyzeTimerRef.current);
    };
  }, []);

  const handleGetStarted = () => {
    if (onNavigate) {
      onNavigate('signup');
    } else if (window.navigate) {
      window.navigate('/signup');
    }
  };

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

      // Present the single real API call in two visible stages:
      // transcription first, then AI analysis.
      analyzeTimerRef.current = setTimeout(() => setIsAnalyzing(true), 1400);

      const audioBlob = await recorderRef.current.stopRecording();
      const base64 = await recorderRef.current.audioToBase64(audioBlob);
      const analysis = await transcribeAndAnalyze(base64);
      setResult(analysis);
    } catch (err) {
      let errorMsg = 'Could not analyze audio. Please try again.';
      if (err.message) {
        if (err.message.includes('401') || err.message.includes('credentials') || err.message.includes('API key') || err.message.includes('API_KEY')) {
          errorMsg = 'API Error: Invalid or missing API key on the server.';
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMsg = 'Network failure. Please check your connection.';
        } else if (err.message.includes('JSON')) {
          errorMsg = 'The AI returned a malformed response.';
        } else if (err.message.includes('timeout')) {
          errorMsg = 'The request timed out. Please try again.';
        } else {
          errorMsg = err.message;
        }
      }
      setError(errorMsg);
      console.error('Demo recording error:', err);
    } finally {
      clearTimeout(analyzeTimerRef.current);
      setIsRecording(false);
      setIsProcessing(false);
      setIsAnalyzing(false);
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
    setIsAnalyzing(false);
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

  const micLabel = isRecording
    ? 'Stop recording and analyze'
    : isProcessing
    ? 'Analyzing audio'
    : 'Start voice recording demo';

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <div
            data-reveal="data-entrance"
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700"
          >
            <Mic size={14} />
            {t('landing_voice_title1') || 'Voice AI'}
          </div>
          <h2
            data-reveal="data-entrance"
            data-reveal-delay="80"
            className="mb-6 text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl lg:text-5xl"
          >
            {t('landing_voice_title2') || 'Just Speak.'}
            <br />
            <span className="text-[#064E3B]">{t('landing_voice_title3') || 'We Handle the Rest.'}</span>
          </h2>
          <p
            data-reveal="data-entrance"
            data-reveal-delay="160"
            className="mx-auto max-w-2xl text-base font-medium text-gray-600 md:text-lg"
          >
            {t('landing_voice_subtitle') || "MarketPulse's voice AI understands natural Nigerian English, Pidgin, and market lingo. Say something like \"I sold 3 bags of rice for 150k\" and watch it become a structured transaction instantly."}
          </p>
        </div>

        {/* Interactive Voice Demo */}
        <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
          {/* Left - Demo UI */}
          <div className="relative">
            {/* Demo Card */}
            <div
              data-reveal="voice-entrance"
              className="relative overflow-hidden rounded-3xl border border-gray-100 bg-[#F9FAFB] p-6 shadow-lg md:p-8"
            >
              {/* Background decorative gradient */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green-100/30 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-blue-100/30 blur-3xl" />

              <div className="relative z-10">
                {/* Microphone Button */}
                <div className="flex flex-col items-center justify-center py-8 md:py-12">
                  <button
                    onClick={toggleRecording}
                    disabled={isProcessing}
                    aria-label={micLabel}
                    aria-pressed={isRecording}
                    className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-80 md:h-28 md:w-28 ${
                      isRecording
                        ? 'scale-110 bg-red-500 shadow-red-500/40'
                        : isProcessing
                        ? 'bg-amber-500 shadow-amber-500/40'
                        : result
                        ? 'bg-green-500 shadow-green-500/40'
                        : 'bg-[#064E3B] shadow-green-900/30 hover:scale-105 hover:shadow-xl hover:shadow-green-900/40'
                    }`}
                  >
                    {/* Outer pulse rings when recording */}
                    {isRecording && (
                      <>
                        <div className="absolute inset-0 rounded-full border-2 border-red-200 opacity-75 animate-ping" />
                        <div
                          className="absolute inset-4 rounded-full border-2 border-red-300 opacity-50 animate-ping"
                          style={{ animationDelay: '100ms' }}
                        />
                        <div
                          className="absolute inset-8 rounded-full border-2 border-red-400 opacity-30 animate-ping"
                          style={{ animationDelay: '200ms' }}
                        />
                      </>
                    )}

                    {isProcessing ? (
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent md:h-14 md:w-14" />
                    ) : isRecording ? (
                      <VoiceWaveform
                        active
                        bars={7}
                        barClassName="bg-white"
                        className="h-10 w-16 md:w-20"
                      />
                    ) : result ? (
                      <ArrowUp size={28} className="md:h-10 md:w-10" />
                    ) : (
                      <Mic size={28} className="md:h-10 md:w-10" />
                    )}
                  </button>

                  {/* Status text — announced to screen readers */}
                  <div role="status" aria-live="polite" className="mt-6 min-h-[1.5rem] text-center">
                    {isRecording && (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                        <span className="text-sm font-semibold text-gray-700">Recording…</span>
                      </div>
                    )}
                    {isProcessing && (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                        <span className="text-sm font-semibold text-gray-700">
                          {isAnalyzing
                            ? 'AI extracting amount, category & type…'
                            : 'Transcribing your audio…'}
                        </span>
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

                  {/* Recording waveform + timer */}
                  {isRecording && (
                    <div className="mt-5 flex flex-col items-center gap-3">
                      <VoiceWaveform
                        active
                        bars={16}
                        barClassName="bg-red-400"
                        className="h-8 w-44"
                      />
                      <div className="rounded-full border border-red-100 bg-red-50 px-4 py-2">
                        <span className="font-mono text-xs font-bold text-red-600">
                          {formatTime(recordingTime)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Result Display */}
                {result && (
                  <div
                    className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5"
                    style={{ animation: `mp-result-in 500ms ${MP_EASE} both` }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
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
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">
                          {result.type === 'CREDIT' ? 'Credit Sale' : result.type === 'Expense' ? 'Expense' : 'Income'}
                        </p>
                        <p className="truncate text-base font-bold text-gray-900">
                          {result.description}
                        </p>
                        <p
                          className={`mt-2 text-2xl font-extrabold md:text-3xl ${
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
                          <span className="mt-2 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                            {result.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 md:p-5">
                    <p className="text-center text-sm font-semibold text-red-600">{error}</p>
                    <button
                      onClick={resetDemo}
                      className="mt-3 text-xs font-semibold text-red-700 underline hover:text-red-800"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {/* Try it hint */}
                {!result && !isRecording && !isProcessing && !error && (
                  <div className="mt-6 text-center">
                    <p className="text-xs font-medium text-gray-400">
                      Try saying: <span className="text-gray-600">"I sold 5 bags of garri for 100k"</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right - How it works */}
          <div className="space-y-6">
            <h3 data-reveal="data-entrance" className="text-2xl font-bold text-gray-900 md:text-3xl">
              {t('landing_voice_how_it_works') || 'How Voice AI Works'}
            </h3>

            <div data-reveal-stagger data-reveal-step="120" className="space-y-6">
              {/* Step 1 */}
              <div data-reveal="data-entrance" className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#064E3B] text-white">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-gray-900">{t('landing_voice_step1_title') || 'Speak Naturally'}</h4>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {t('landing_voice_step1_desc') || 'Tap the microphone and say your transaction in plain language. Use your native market lingo — no special format required.'}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div data-reveal="data-entrance" className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#064E3B] text-white">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-gray-900">{t('landing_voice_step2_title') || 'AI Understands Context'}</h4>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {t('landing_voice_step2_desc') || 'Our AI extracts the amount, item, category, and even credit details from your natural speech.'}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div data-reveal="data-entrance" className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#064E3B] text-white">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-gray-900">{t('landing_voice_step3_title') || 'Instant Structured Data'}</h4>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {t('landing_voice_step3_desc') || 'Your transaction is logged, categorized, and ready for reporting. No typing, no spreadsheets.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Supported examples */}
            <div
              data-reveal="data-entrance"
              className="mt-8 rounded-2xl border border-gray-100 bg-[#F9FAFB] p-5"
            >
              <h4 className="mb-3 font-bold text-gray-900">Try saying:</h4>
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
              data-reveal="data-entrance"
              onClick={handleGetStarted}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#064E3B] px-6 py-4 font-bold text-white shadow-lg shadow-green-900/20 transition-all duration-300 hover:bg-[#043d2e] hover:shadow-xl hover:shadow-green-900/30"
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
