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
  );
}

function MutedMicrophoneIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="24" y="10" width="16" height="31" rx="8" fill="currentColor" />
      <path d="M16 31c0 9 6.7 16 16 16s16-7 16-16" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M32 47v9" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="12" y1="12" x2="52" y2="52" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="8" y="8" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.7" />
    </svg>
  );
}

export default function Listeng({ onNavigate, businessName }) {
  const recorderRef = useRef(null);
  const timerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [micError, setMicError] = useState(null);

  useEffect(() => {
    recorderRef.current = new VoiceRecorder();
    
    return () => {
      if (recorderRef.current) {
        recorderRef.current.stopMediaStream();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleStartRecording = async () => {
    setMicError(null);
    try {
      await recorderRef.current.startRecording();
      setIsRecording(true);
      setRecordSeconds(0);
      
      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone start failed:", err);
      setMicError(
        err.message?.includes("Permission") || err.message?.includes("denied")
          ? "Microphone access was denied. Please allow microphone permissions in your browser to record your trade."
          : `Could not access microphone: ${err.message || "Unknown error"}`
      );
    }
  };

  const handleStopAndAnalyze = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!recorderRef.current || !isRecording) {
      if (onNavigate) onNavigate('analysing');
      return;
    }
    
    try {
      const audioBlob = await recorderRef.current.stopRecording();
      setIsRecording(false);
      const audioBase64 = await recorderRef.current.audioToBase64(audioBlob);
      const mimeType = audioBlob.actualMimeType || audioBlob.type || "audio/webm";
      const audioStats = {
        size: audioBlob.recordedSize || audioBlob.size,
        duration: audioBlob.duration || Math.max(1, recordSeconds),
        mimeType: mimeType
      };
      
      if (onNavigate) {
        onNavigate('analysing', { audioBase64, mimeType, audioStats });
      }
    } catch (err) {
      console.error("Error stopping recording:", err);
      setIsRecording(false);
      setMicError(err.message || "Failed to finalize audio recording");
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
          onClick={!isRecording ? handleStartRecording : handleStopAndAnalyze}
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

        <h1 id="listening-title">
          {isRecording ? `Listening... (${formatTimer(recordSeconds)})` : "Pulse AI Ready"}
        </h1>

        <p>
          {isRecording 
            ? 'Go ahead, tell me about your trade (e.g., "Sold 2 bags of garri for 15k" or "I sell am 5k")' 
            : 'Tap Start Recording to log your trade via voice.'}
        </p>

        {micError && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #f87171',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#b91c1c',
            fontSize: '14px',
            margin: '12px 0',
            maxWidth: '380px',
            textAlign: 'center'
          }}>
            {micError}
          </div>
        )}

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
  );
}
