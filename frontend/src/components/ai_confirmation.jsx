import { useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useState, useEffect, useRef } from 'react';

export default function AIConfirmation({ onNavigate }) {
  const location = useLocation();
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (location.state?.audioBase64) {
      audioRef.current = new Audio(`data:audio/webm;base64,${location.state.audioBase64}`);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [location.state?.audioBase64]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const transactionData = location.state?.transactionData || {
    type: 'Income',
    amount: 15000,
    description: '2 bags of garri',
    category: 'Dry Goods'
  };

  const isIncome = transactionData.type?.toLowerCase() === 'income';

  if (transactionData.type === 'UNKNOWN_AMOUNT' || transactionData.amount === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col p-8 lg:p-12 items-center text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('confirm_no_amount_title')}</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            {t('confirm_no_amount_copy')}
          </p>
          {location.state?.audioBase64 && (
            <button
              onClick={togglePlay}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all mb-4"
            >
              <svg className="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="currentColor">
                {isPlaying ? (
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                ) : (
                  <path d="M8 5v14l11-7z" />
                )}
              </svg>
              <span>{isPlaying ? 'Pause Recording' : (t('confirm_play_recording') || 'Play Recording')}</span>
            </button>
          )}
          <button
            onClick={() => onNavigate('listeng')}
            className="w-full bg-[#052e16] hover:bg-[#022c22] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg active:scale-95"
          >
            {t('confirm_record_again')}
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-6 rounded-xl transition-all active:scale-95"
          >
            {t('confirm_cancel')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 lg:p-12">
      <div className="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Side: Information Panel */}
        <div className="flex-1 p-8 lg:p-12 bg-gradient-to-br from-slate-50 to-slate-100 border-r border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-12">
            <button 
              onClick={() => onNavigate('home')}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-800">
              {t('confirm_title')}
            </h1>
            <div className="w-12 h-12"></div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-slate-500 text-lg lg:text-xl font-medium mb-8 leading-relaxed">
              Confirm the transaction details parsed by Gemini 1.5 Flash.
            </h2>
            
            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-600 shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold text-blue-900 mb-1">
                  {t('confirm_pin_required')}
                </h4>
                <p className="text-blue-700/80 text-sm leading-relaxed">
                  {t('confirm_pin_copy')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Transaction Card & Action */}
        <div className="flex-1 p-8 lg:p-12 bg-white flex flex-col justify-between relative">
          {/* Card Watermark */}
          <svg className="absolute right-0 bottom-32 w-48 h-48 text-slate-50 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="20" r="6" />
            <circle cx="35" cy="35" r="6" />
            <circle cx="65" cy="35" r="6" />
            <circle cx="20" cy="50" r="6" />
            <circle cx="50" cy="50" r="6" />
            <circle cx="80" cy="50" r="6" />
            <circle cx="35" cy="65" r="6" />
            <circle cx="65" cy="65" r="6" />
            <circle cx="50" cy="80" r="6" />
          </svg>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isIncome ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {isIncome ? (
                    <>
                      <path d="M21 8v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
                      <path d="M21 8l-2-4H5L3 8" />
                      <path d="M10 12h4" />
                    </>
                  ) : (
                    <>
                      <line x1="12" y1="2" x2="12" y2="22" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </>
                  )}
                </svg>
              </div>
              <span className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider ${isIncome ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {transactionData.type}
              </span>
            </div>

            <div className="mb-10">
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase block mb-2">
                {t('pin_transaction_amount')}
              </span>
              <h3 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
                ₦{Number(transactionData.amount).toLocaleString()}
              </h3>
            </div>

            <div className="h-px w-full bg-slate-100 mb-8" />

            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <span className="text-xs font-bold text-slate-400 tracking-widest uppercase block mb-2">
                  {t('confirm_description')}
                </span>
                <span className="text-lg font-bold text-slate-800 leading-tight">
                  {transactionData.description}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 tracking-widest uppercase block mb-2">
                  {t('confirm_category')}
                </span>
                <span className="text-lg font-bold text-slate-800 leading-tight">
                  {transactionData.category}
                </span>
              </div>
            </div>
          </div>

          {location.state?.audioBase64 && (
            <button
              onClick={togglePlay}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all mb-4 z-20 relative active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                {isPlaying ? (
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                ) : (
                  <path d="M8 5v14l11-7z" />
                )}
              </svg>
              <span className="text-lg tracking-wide">{isPlaying ? 'Pause Recording' : (t('confirm_play_recording') || 'Play Recording')}</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('pulse_trade_pin', { transactionData })}
            className="w-full bg-[#052e16] hover:bg-[#022c22] text-white font-bold py-5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-900/20 active:scale-[0.98] z-20 relative"
          >
            <span className="text-lg tracking-wide">{t('confirm_button')}</span>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

        </div>
      </div>
    </div>
  );
}
