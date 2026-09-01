import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { transcribeAndAnalyze } from '../../services/geminiService';
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

  useEffect(() => {
    if (!onNavigate) return undefined;

    let isMounted = true;

    const analyzeAudio = async () => {
      try {
        const audioBase64 = location.state?.audioBase64;
        let transactionData = null;

        if (audioBase64) {
          transactionData = await transcribeAndAnalyze(audioBase64);
        } else {
          // Fallback static analysis if no audio provided (simulated delay)
          await new Promise(resolve => setTimeout(resolve, ANALYSIS_DURATION_MS));
          transactionData = {
            type: "Income",
            amount: 15000,
            description: "Sold 2 bags of garri",
            category: "Dry Goods"
          };
        }

        if (isMounted) {
          onNavigate(ANALYSIS_NEXT_PAGE, { transactionData });
        }
      } catch (error) {
        console.error("Analysis failed:", error);
        // Fallback on error
        if (isMounted) {
          onNavigate(ANALYSIS_NEXT_PAGE, { 
            transactionData: {
                type: "Income",
                amount: 0,
                description: `Analysis failed: ${error.message || error.toString()}`,
                category: "Other"
            }
          });
        }
      }
    };

    analyzeAudio();

    return () => {
      isMounted = false;
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
            <span className="analysing-sparkles">
              <SparklesIcon />
            </span>
          </div>

          <h1 id="analysing-title">Analyzing your<br />speech...</h1>
          <p>Gemini is sorting your trade details into your ledger.</p>

          <div className="analysing-skeletons" aria-hidden="true">
            <span className="analysing-skeleton analysing-skeleton-wide">
              <span className="analysing-progress-fill" />
            </span>
            <span className="analysing-skeleton analysing-skeleton-short" />
          </div>
        </section>

        <div className="analysing-bottom-preview" aria-hidden="true" />

        <NavigationBar onNavigate={onNavigate} currentPage="pulse" />
      </section>
    </main>
  );
}
