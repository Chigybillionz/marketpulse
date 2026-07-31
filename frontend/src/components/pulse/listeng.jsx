import { useEffect, useRef, useState } from 'react';
import { VoiceRecorder } from '../../services/voiceRecorder';
import Header from '../home/Header';

function StoreIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 13h20l-2.2-6.5H8.2L6 13Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M8 13v12h16V13" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M11 25v-7h10v7" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M5 13h22" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2.3" />
      <circle cx="16" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2.3" />
      <path d="M8.8 25c1.6-4 4-6 7.2-6s5.6 2 7.2 6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  )
}

function MicrophoneIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="24" y="10" width="16" height="31" rx="8" fill="currentColor" />
      <path d="M16 31c0 9 6.7 16 16 16s16-7 16-16" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M32 47v9" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

function MutedMicrophoneIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="24" y="10" width="16" height="31" rx="8" fill="currentColor" />
      <path d="M16 31c0 9 6.7 16 16 16s16-7 16-16" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M32 47v9" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="12" y1="12" x2="52" y2="52" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="8" y="8" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.7" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <path d="M5 12.4 14 5l9 7.4V24h-6v-7h-6v7H5V12.4Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <path d="M7.5 8.2A9 9 0 1 1 6 15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M4 8.2h3.5V4.7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 9v6l4 2" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

function CreditIcon() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <rect x="4" y="8" width="20" height="13" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="14" cy="14.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="2.1" />
      <path d="M4 12h3M21 17h3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export default function Listeng({ onNavigate, businessName }) {
  const recorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    recorderRef.current = new VoiceRecorder();
    
    return () => {
      if (recorderRef.current) {
        recorderRef.current.stopMediaStream();
      }
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      await recorderRef.current.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setError("Microphone access denied or not supported.");
    }
  };


  const handleStopAndAnalyze = async () => {
    if (!recorderRef.current || !isRecording) {
        if (onNavigate) onNavigate('analysing'); // Fallback if mic failed
        return;
    }
    
    try {
      const audioBlob = await recorderRef.current.stopRecording();
      setIsRecording(false);
      const audioBase64 = await recorderRef.current.audioToBase64(audioBlob);
      
      if (onNavigate) {
        onNavigate('analysing', { audioBase64 });
      }
    } catch (err) {
      console.error("Error stopping recording:", err);
      setError("Failed to process audio.");
      if (onNavigate) onNavigate('analysing'); // Fallback
    }
  };

  return (
    <main className="listening-page" aria-label="MarketPulse AI voice listening screen">
        <Header businessName={businessName} onNavigate={onNavigate} />

        <section className="listening-main" aria-labelledby="listening-title">
          <button 
            className="listening-mic" 
            type="button" 
            aria-label="Recording toggle"
            style={!isRecording ? { boxShadow: 'none', background: '#d1d5db', color: '#4b5563', animation: 'none' } : {}}
          >
            {isRecording && (
              <span className="listening-signal listening-signal-left" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            )}
            
            {isRecording ? <MicrophoneIcon /> : <MutedMicrophoneIcon />}
            
            {isRecording && (
              <span className="listening-signal listening-signal-right" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            )}
          </button>

          <h1 id="listening-title">{isRecording ? "Listening..." : "Pulse AI Ready"}</h1>
          <p>{isRecording ? 'Go ahead, tell me about your trade (e.g., "Sold 2 bags of garri for 15k")' : 'Tap Start Recording to log your trade via voice.'}</p>

          <div className="listening-actions">
            {!isRecording ? (
              <button 
                type="button" 
                className="listening-stop cursor-pointer"
                onClick={handleStartRecording}
                style={{ background: '#052e16' }}
              >
                <div style={{ width: 20, height: 20, flexShrink: 0, marginRight: 4 }}>
                  <MicrophoneIcon />
                </div>
                <span>Start Recording</span>
              </button>
            ) : (
              <button 
                type="button" 
                className="listening-stop cursor-pointer"
                onClick={handleStopAndAnalyze}
              >
                <StopIcon />
                <span>Stop &amp; Analyze</span>
              </button>
            )}
            <button 
              type="button" 
              className="listening-cancel cursor-pointer"
              onClick={() => onNavigate && onNavigate('home')}
            >
              Cancel
            </button>
          </div>
          </section>
        <div style={{ flexShrink: 0, width: "100%" }} className="mobile-only-nav">
          <nav className="listening-bottom-nav" aria-label="Primary navigation">
            <button 
              onClick={() => onNavigate && onNavigate('home')} 
              aria-label="Home"
              className="cursor-pointer flex flex-col items-center bg-transparent border-0 text-gray-400 hover:text-gray-600 font-sans"
            >
              <HomeIcon />
              <span>Home</span>
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('listeng')} 
              className="active cursor-pointer flex flex-col items-center bg-transparent border-0 font-sans"
            >
              <span className="active-icon">
                <MicrophoneIcon />
              </span>
              <span>Pulse</span>
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('history')} 
              aria-label="History"
              className="cursor-pointer flex flex-col items-center bg-transparent border-0 text-gray-400 hover:text-gray-600 font-sans"
            >
              <HistoryIcon />
              <span>History</span>
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('credit')} 
              aria-label="Credit"
              className="cursor-pointer flex flex-col items-center bg-transparent border-0 text-gray-400 hover:text-gray-600 font-sans"
            >
              <CreditIcon />
              <span>Credit</span>
            </button>
          </nav>
        </div>
    </main>
  )
}
