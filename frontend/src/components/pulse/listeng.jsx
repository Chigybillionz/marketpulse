import { useEffect, useRef, useState } from 'react';
import { VoiceRecorder } from '../../services/voiceRecorder';
import Header from '../home/Header';
import NavigationBar from '../home/NavigationBar';


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



export default function Listeng({ onNavigate, businessName }) {
  const recorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

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
      console.error(err);
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
      const mimeType = audioBlob.type || "audio/webm";
      
      if (onNavigate) {
        onNavigate('analysing', { audioBase64, mimeType });
      }
    } catch (err) {
      console.error("Error stopping recording:", err);
      console.error("Error stopping recording:", err);
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
        <NavigationBar onNavigate={onNavigate} currentPage="listeng" />
    </main>
  )
}
