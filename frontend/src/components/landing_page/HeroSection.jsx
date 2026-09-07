import React, { useState, useRef, useEffect } from 'react';
import { Mic, BarChart2, Lock, Wallet, Play, ArrowRight, ArrowUp, ArrowDown, X, TrendingUp, Activity, CheckCircle } from 'lucide-react';
import { VoiceRecorder } from '../../services/voiceRecorder';
import { transcribeAndAnalyze } from '../../services/geminiService';

// Subtle floating animation for background elements
const floatingAnimation = `
  @keyframes float-1 {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    33% { transform: translateY(-8px) translateX(4px); }
    66% { transform: translateY(4px) translateX(-3px); }
  }
  @keyframes float-2 {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    40% { transform: translateY(-6px) translateX(-5px); }
    70% { transform: translateY(6px) translateX(3px); }
  }
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.05); }
  }
  @keyframes chart-fade {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes bar-grow {
    0% { transform: scaleY(0.3); }
    100% { transform: scaleY(1); }
  }
`;

// Chart bars component
function ChartBars({ colorClass, heights, delay = 0 }) {
  return (
    <div className="flex items-end gap-1.5 h-full" style={{ animationDelay: `${delay}ms` }}>
      {heights.map((height, i) => (
        <div
          key={i}
          className={`rounded-t-md transition-all duration-500 ${colorClass}`}
          style={{
            height: `${height}%`,
            animation: 'bar-grow 0.6s ease-out forwards',
            animationDelay: `${delay + i * 80}ms`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

// Floating data point
function FloatingData({ label, value, icon: Icon, color, delay }) {
  return (
    <div
      className="absolute w-fit px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm border border-gray-100 text-xs font-semibold"
      style={{
        animation: 'float-1 6s ease-in-out infinite',
        animationDelay: `${delay}ms`,
        opacity: 0,
        animationFillMode: 'forwards',
      }}
    >
      <div className="flex items-center gap-2">
        <Icon size={14} className={color} />
        <span className="text-gray-600">{label}</span>
      </div>
      <div className={`text-sm font-bold ${color}`}>{value}</div>
    </div>
  );
}

export default function HeroSection({ onNavigate, voiceDemoState, onVoiceStateChange }) {
  const [showDemoVideo, setShowDemoVideo] = useState(false);
  const [micState, setMicState] = useState('IDLE'); // IDLE, LISTENING, PROCESSING, ANALYZING, RESULT
  const [demoResult, setDemoResult] = useState(null);
  const [demoError, setDemoError] = useState(null);
  const recorderRef = useRef(null);

  // Sync with parent voice demo state if provided
  useEffect(() => {
    if (voiceDemoState) {
      setMicState(voiceDemoState.state || 'IDLE');
      setDemoResult(voiceDemoState.result || null);
      setDemoError(voiceDemoState.error || null);
    }
  }, [voiceDemoState]);

  const handleGetStarted = () => {
    if (onNavigate) {
      onNavigate("signup");
    } else {
      const navigate = window.navigate;
      if (navigate) navigate("/signup");
    }
  };

  const handleDemoRecord = async () => {
    setDemoError(null);
    setDemoResult(null);

    if (micState === 'LISTENING') {
      // Stop recording and analyze
      try {
        setMicState('PROCESSING');
        if (onVoiceStateChange) onVoiceStateChange('PROCESSING');

        const audioBlob = await recorderRef.current.stopRecording();
        const base64 = await recorderRef.current.audioToBase64(audioBlob);
        const result = await transcribeAndAnalyze(base64);

        setDemoResult(result);
        setMicState('RESULT');
        if (onVoiceStateChange) onVoiceStateChange('RESULT');
      } catch (err) {
        setDemoError('Could not analyze audio. Please try again.');
        console.error('Demo recording error:', err);
        setMicState('IDLE');
        if (onVoiceStateChange) onVoiceStateChange('IDLE');
      } finally {
        recorderRef.current = null;
      }
    } else {
      // Start recording
      try {
        recorderRef.current = new VoiceRecorder();
        await recorderRef.current.startRecording();
        setMicState('LISTENING');
        if (onVoiceStateChange) onVoiceStateChange('LISTENING');
      } catch (err) {
        setDemoError('Microphone access denied. Please allow microphone access.');
        console.error('Demo recording error:', err);
      }
    }
  };

  const resetDemo = () => {
    setMicState('IDLE');
    setDemoResult(null);
    setDemoError(null);
    if (onVoiceStateChange) onVoiceStateChange('IDLE');
  };

  return (
    <>
      <style>{floatingAnimation}</style>

      {/* Hero Section */}
      <section
        data-reveal="fade-up"
        className="w-full px-4 sm:px-6 lg:px-12 pt-12 md:pt-20 pb-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto"
      >
        {/* Left Content */}
        <div className="space-y-6 md:space-y-8 z-10">
          <div
            data-reveal="fade-in"
            data-reveal-delay="100"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E5E7EB]/60 border border-gray-200 text-xs md:text-sm font-semibold text-gray-700 shadow-sm w-fit"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
            Trusted by 5,000+ Nigerian Traders
          </div>

          <h1
            data-reveal="fade-up"
            data-reveal-delay="200"
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-[#111827]"
          >
            Your Market Business,
            <br />
            <span className="text-[#064E3B]">Perfectly Balanced.</span>
          </h1>

          <p
            data-reveal="fade-up"
            data-reveal-delay="300"
            className="text-base md:text-lg text-gray-600 max-w-lg leading-relaxed font-medium"
          >
            Speak your sales, expenses, and debts. We track it all instantly,
            so you always know your true profit. Voice-first bookkeeping built
            for the hustle.
          </p>

          <div
            data-reveal="fade-up"
            data-reveal-delay="400"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2"
          >
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto bg-[#064E3B] text-white px-7 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#043d2e] transition-colors shadow-lg shadow-green-900/20 hover:shadow-xl hover:shadow-green-900/30 hover:-translate-y-0.5"
            >
              Get Started <ArrowRight size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setShowDemoVideo(true)}
              className="w-full sm:w-auto bg-white border border-gray-200 text-gray-800 px-7 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
            >
              <Play size={18} className="text-gray-500" fill="currentColor" />
              Watch Demo
            </button>
          </div>

          {/* Trust indicators */}
          <div
            data-reveal="fade-in"
            data-reveal-delay="500"
            className="flex items-center gap-6 pt-4"
          >
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-xs font-bold text-green-700">
                M
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-700">
                A
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-xs font-bold text-purple-700">
                K
              </div>
            </div>
            <div className="text-xs text-gray-500 font-medium">
              <span className="font-bold text-gray-700">4.9/5</span> from 2,000+ reviews
            </div>
          </div>
        </div>

        {/* Right - Product Visualization */}
        <div
          data-reveal="fade-up"
          data-reveal-delay="200"
          className="relative rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border border-gray-200 bg-white aspect-[4/3] md:aspect-[16/11] flex flex-col mt-8 lg:mt-0 lg:translate-x-4 group"
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-blue-50/20 pointer-events-none" />

          {/* Floating data points (decorative) */}
          <FloatingData
            label="Profit Margin"
            value="+23.5%"
            icon={TrendingUp}
            color="text-green-600"
            delay={300}
          />
          <FloatingData
            label="Today's Sales"
            value="₦127,400"
            icon={Activity}
            color="text-blue-600"
            delay={400}
          />

          {/* Mock UI Header */}
          <div className="border-b border-gray-100 p-3 md:p-4 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-24 md:w-32 h-4 bg-gray-200 rounded-full"></div>
              <div className="hidden sm:block w-16 h-4 bg-gray-100 rounded-full"></div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>

          {/* Mock UI Body */}
          <div className="flex-1 bg-gray-50 relative overflow-hidden">
            {/* Dashboard mockup content */}
            <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end">
              {/* Dashboard stats */}
              <div className="space-y-4 w-full">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white/95 backdrop-blur p-3 md:p-4 rounded-xl border border-white/20 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <TrendingUp size={14} className="md:w-5 md:h-5 text-green-600" />
                      </div>
                      <span className="text-[9px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">Revenue</span>
                    </div>
                    <p className="text-base md:text-xl font-black text-gray-900">₦847,200</p>
                    <p className="text-[9px] md:text-xs text-green-600 font-semibold">+12.4% this week</p>
                  </div>

                  <div className="bg-white/95 backdrop-blur p-3 md:p-4 rounded-xl border border-white/20 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <TrendingUp size={14} className="md:w-5 md:h-5 text-red-600 rotate-180" />
                      </div>
                      <span className="text-[9px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">Expenses</span>
                    </div>
                    <p className="text-base md:text-xl font-black text-gray-900">₦312,800</p>
                    <p className="text-[9px] md:text-xs text-red-500 font-semibold">+3.2% this week</p>
                  </div>
                </div>

                {/* Mini chart */}
                <div className="bg-white/95 backdrop-blur p-3 md:p-4 rounded-xl border border-white/20 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">7-Day Trend</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-300/80"></div>
                    </div>
                  </div>
                  <div className="h-16 md:h-20 w-full bg-gray-100 rounded-lg overflow-hidden">
                    <ChartBars
                      colorClass="bg-gradient-to-t from-green-400 to-green-500"
                      heights={[30, 45, 35, 60, 50, 75, 85, 65, 90, 70]}
                      delay={500}
                    />
                  </div>
                </div>

                {/* Voice Demo Button Area */}
                <div className="flex flex-col sm:flex-row gap-4 w-full items-end justify-between pt-2">
                  {/* Voice Recorder Demo */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleDemoRecord}
                      disabled={micState === 'PROCESSING' || micState === 'ANALYZING'}
                      className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg text-white transition-all duration-300 ${
                        micState === 'LISTENING'
                          ? 'bg-red-500 shadow-red-500/40 animate-pulse'
                          : micState === 'PROCESSING' || micState === 'ANALYZING'
                          ? 'bg-yellow-500 shadow-yellow-500/40'
                          : micState === 'RESULT'
                          ? 'bg-blue-500 shadow-blue-500/40'
                          : 'bg-[#064E3B] shadow-green-900/30 hover:bg-[#043d2e] hover:shadow-xl'
                      }`}
                    >
                      {micState === 'LISTENING' && (
                        <>
                          <span className="w-3 h-3 rounded-full bg-white animate-pulse"></span>
                          <span className="text-sm font-semibold">Recording...</span>
                        </>
                      )}
                      {micState === 'PROCESSING' && (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-semibold">Processing</span>
                        </>
                      )}
                      {micState === 'ANALYZING' && (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-semibold">Analyzing</span>
                        </>
                      )}
                      {micState === 'RESULT' && (
                        <>
                          <CheckCircle size={18} />
                          <span className="text-sm font-semibold">Analyzed!</span>
                        </>
                      )}
                      {micState === 'IDLE' && (
                        <>
                          <Mic size={18} />
                          <span className="text-sm font-semibold">Tap to Test</span>
                        </>
                      )}
                    </button>

                    {micState !== 'IDLE' && (
                      <button
                        onClick={resetDemo}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Reset demo"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>

                  {/* Recording Status / Result */}
                  {(micState === 'LISTENING' || micState === 'PROCESSING' || micState === 'ANALYZING') && (
                    <div
                      className={`flex-1 ${
                        micState === 'LISTENING'
                          ? 'bg-red-500/90 backdrop-blur'
                          : micState === 'PROCESSING' || micState === 'ANALYZING'
                          ? 'bg-yellow-500/90 backdrop-blur'
                          : 'bg-blue-500/90 backdrop-blur'
                      } p-3 rounded-xl text-white text-sm font-semibold text-center transition-all duration-300`}
                    >
                      {micState === 'LISTENING' && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                          Recording... Tap mic to stop and analyze
                        </div>
                      )}
                      {micState === 'PROCESSING' && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                          Converting speech to text...
                        </div>
                      )}
                      {micState === 'ANALYZING' && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                          Analyzing transaction details...
                        </div>
                      )}
                    </div>
                  )}

                  {demoError && (
                    <div className="flex-1 bg-red-500/90 backdrop-blur p-3 rounded-xl text-white text-sm font-semibold text-center">
                      {demoError}
                    </div>
                  )}

                  {demoResult && (
                    <div className="flex-1 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg border border-white/20">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            demoResult.type === 'Expense'
                              ? 'bg-red-100 text-red-600'
                              : demoResult.type === 'CREDIT'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-green-100 text-green-600'
                          }`}
                        >
                          {demoResult.type === 'Expense' ? (
                            <ArrowDown size={20} />
                          ) : demoResult.type === 'CREDIT' ? (
                            <Wallet size={20} />
                          ) : (
                            <ArrowUp size={20} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider truncate">
                            {demoResult.description || 'Voice Transaction'}
                          </p>
                          <p
                            className={`text-lg font-black ${
                              demoResult.type === 'Expense'
                                ? 'text-red-600'
                                : demoResult.type === 'CREDIT'
                                ? 'text-blue-600'
                                : 'text-green-600'
                            }`}
                          >
                            {demoResult.type === 'Expense' ? '-' : '+'}
                            ₦{(demoResult.amount || 0).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                          {demoResult.type === 'CREDIT' ? 'Credit' : demoResult.type}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Modal */}
      {showDemoVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-5xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/20 transform transition-transform duration-300">
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none">
              <div className="flex items-center gap-2 text-white">
                <Play size={20} fill="currentColor" />
                <span className="font-bold text-sm md:text-base">MarketPulse AI Demo</span>
              </div>
              <button
                onClick={() => setShowDemoVideo(false)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white backdrop-blur-md transition-colors pointer-events-auto"
                aria-label="Close demo video"
              >
                <X size={24} />
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full bg-black">
              <video
                src="/demovideo.mp4"
                autoPlay
                controls
                className="w-full h-full object-contain"
                onEnded={() => setShowDemoVideo(false)}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


