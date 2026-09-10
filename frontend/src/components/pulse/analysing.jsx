import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { transcribeAndAnalyze } from '../../services/geminiService';
import { useLanguage } from '../../i18n/LanguageContext';
import NavigationBar from '../home/NavigationBar';
const ANALYSIS_DURATION_MS = 3500;
const ANALYSIS_NEXT_PAGE = 'ai_confirmation';

function StoreIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 13h20l-2.2-6.5H8.2L6 13Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M8 13v12h16V13" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M11 25v-7h10v7" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M5 13h22" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2.3" />
      <circle cx="16" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2.3" />
      <path d="M8.8 25c1.6-4 4-6 7.2-6s5.6 2 7.2 6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <path d="M30 14c2.8 9.2 7.8 14.2 17 17-9.2 2.8-14.2 7.8-17 17-2.8-9.2-7.8-14.2-17-17 9.2-2.8 14.2-7.8 17-17Z" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
      <path d="M50 7c1.5 5.2 4.3 8 9.5 9.5C54.3 18 51.5 20.8 50 26c-1.5-5.2-4.3-8-9.5-9.5C45.7 15 48.5 12.2 50 7Z" fill="currentColor" />
      <path d="M51 43c1.5 5.2 4.3 8 9.5 9.5C55.3 54 52.5 56.8 51 62c-1.5-5.2-4.3-8-9.5-9.5C46.7 51 49.5 48.2 51 43Z" fill="currentColor" />
    </svg>
  );
}



export default function Analysing({ onNavigate, businessName }) {
  const location = useLocation();
  const { t } = useLanguage();
  const [analysisStatus, setAnalysisStatus] = useState('analyzing'); // 'analyzing' | 'success' | 'error' | 'quota_error'
  const [quotaRetrySec, setQuotaRetrySec] = useState(null);

  // Guard against duplicate analysis runs. React StrictMode (dev) mounts,
  // unmounts and remounts effects once, which previously fired TWO
  // analyze-voice requests per recording — doubling Gemini quota usage.
  const analyzedAudioRef = useRef(null);

  useEffect(() => {
    if (!onNavigate) return undefined;

    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted && analysisStatus === 'analyzing') {
        setAnalysisStatus('error');
      }
    }, ANALYSIS_DURATION_MS + 5000); // Timeout after analysis duration + buffer

    const analyzeAudio = async () => {
      const audioBase64 = location.state?.audioBase64;

      // Skip if this exact audio was already analyzed (StrictMode re-run).
      if (audioBase64 && analyzedAudioRef.current === audioBase64) return;
      if (audioBase64) analyzedAudioRef.current = audioBase64;

      try {
        let transactionData = null;

        if (audioBase64) {
          setAnalysisStatus('analyzing');
          transactionData = await transcribeAndAnalyze(audioBase64);
          setAnalysisStatus('success');
        } else {
          // Fallback static analysis if no audio provided (simulated delay)
          await new Promise(resolve => setTimeout(resolve, ANALYSIS_DURATION_MS));
          transactionData = {
            type: "Income",
            amount: 0,
            description: "Voice recording not available",
            category: "Other"
          };
          setAnalysisStatus('success');
        }

        if (isMounted) {
          onNavigate(ANALYSIS_NEXT_PAGE, { transactionData, audioBase64 });
        }
      } catch (error) {
        console.error("Analysis failed:", error);
        const errorMessage = error.message || error.toString();

        // Backend sends retryAfterSec when quota is exhausted.
        const retryMatch = /retry in about (\\d+)s/i.exec(errorMessage);
        const retrySec = error.retryAfterSec || (retryMatch ? parseInt(retryMatch[1], 10) : null);

        // Check if it's a quota error
        if (
          errorMessage.includes('429') ||
          errorMessage.includes('quota') ||
          errorMessage.includes('Too Many Requests') ||
          errorMessage.includes('cooling down')
        ) {
          setAnalysisStatus('quota_error');
          setQuotaRetrySec(retrySec);
        } else {
          setAnalysisStatus('error');
        }

        // Still navigate to next page with fallback data
        if (isMounted) {
          // Wait a moment to show the error state
          setTimeout(() => {
            if (isMounted) {
              onNavigate(ANALYSIS_NEXT_PAGE, { 
                transactionData: {
                    type: "UNKNOWN_AMOUNT",
                    amount: 0,
                    description: "AI analysis unavailable - please enter manually",
                    category: "Other",
                    aiError: errorMessage.substring(0, 100)
                },
                audioBase64
              });
            }
          }, 2000);
        }
      }
    };

    analyzeAudio();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [onNavigate, location.state]);

  return (
    <main className="listening-page" aria-label="MarketPulse AI speech analysis screen">
      <section
        className="listening-phone analysing-phone"
        style={{ '--analysis-duration': `${ANALYSIS_DURATION_MS}ms` }}
      >
        <header className="listening-header">
          <button
            className="listening-brand analysing-brand-button"
            type="button"
            aria-label="Go home"
            onClick={() => onNavigate && onNavigate('home')}
          >
            <span className="listening-store-icon">
              <StoreIcon />
            </span>
            <span>{businessName || 'My Store'}</span>
          </button>

          <button
            className="listening-user cursor-pointer"
            type="button"
            aria-label="Open profile"
            onClick={() => onNavigate && onNavigate('profile')}
          >
            <UserIcon />
          </button>
        </header>

        <section className="analysing-main" aria-labelledby="analysing-title">
          <div className="analysing-ring" aria-hidden="true">
            <svg viewBox="0 0 240 240">
              <circle className="analysing-ring-track" cx="120" cy="120" r="98" />
              <circle className="analysing-ring-progress" cx="120" cy="120" r="98" />
            </svg>
            <span className="analysing-sparkles" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/mylogo.png" alt="MarketPulse AI logo" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
            </span>
          </div>

          {analysisStatus === 'analyzing' && (
            <>
              <h1 id="analysing-title">{t('analysing_title')}</h1>
              <p>{t('analysing_copy')}</p>

              <div className="analysing-skeletons" aria-hidden="true">
                <span className="analysing-skeleton analysing-skeleton-wide">
                  <span className="analysing-progress-fill" />
                </span>
                <span className="analysing-skeleton analysing-skeleton-short" />
              </div>
            </>
          )}

          {analysisStatus === 'error' && (
            <>
              <h1 id="analysing-title" style={{ color: '#dc2626' }}>{t('analysing_error')}</h1>
              <p>{t('analysing_error_copy')}</p>
              <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
                {t('analysing_manual_copy')}
              </p>
            </>
          )}

          {analysisStatus === 'quota_error' && (
            <>
              <h1 id="analysing-title" style={{ color: '#f59e0b' }}>{t('analysing_busy')}</h1>
              <p>{t('analysing_busy_copy')}</p>
              <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
                {quotaRetrySec
                  ? t('analysing_busy_retry', { seconds: quotaRetrySec })
                  : 'Please try again in a few moments, or your transaction will be saved for manual entry.'}
              </p>
            </>
          )}

          {analysisStatus === 'success' && (
            <>
              <h1 id="analysing-title" style={{ color: '#059669' }}>{t('analysing_complete')}</h1>
              <p>{t('analysing_complete_copy')}</p>
            </>
          )}
        </section>

        <div className="analysing-bottom-preview" aria-hidden="true" />

        <NavigationBar onNavigate={onNavigate} currentPage="pulse" />
      </section>
    </main>
  );
}
