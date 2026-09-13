import { useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useState, useEffect, useRef } from 'react';

export default function AIConfirmation({ onNavigate }) {
  const location = useLocation();
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [manualAmount, setManualAmount] = useState('');
  const [isEnteringManual, setIsEnteringManual] = useState(false);
  const audioRef = useRef(null);

  const rawMimeType = location.state?.mimeType || 'audio/webm';
  const audioBase64 = location.state?.audioBase64;

  const initialTransactionData = location.state?.transactionData || {
    transcript: '',
    type: 'Income',
    amount: 15000,
    description: '2 bags of garri',
    category: 'Dry Goods',
  };

  const [transactionData, setTransactionData] = useState(initialTransactionData);

  useEffect(() => {
    if (audioBase64) {
      try {
        audioRef.current = new Audio(`data:${rawMimeType};base64,${audioBase64}`);
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = (e) => {
          console.warn('Audio playback initialization warning:', e);
          setIsPlaying(false);
        };
      } catch (err) {
        console.warn('Could not initialize audio player:', err);
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioBase64, rawMimeType]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Audio play failed:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleApplyManualAmount = () => {
    const num = parseFloat(manualAmount.replace(/[^0-9.]/g, ''));
    if (!isNaN(num) && num > 0) {
      const updated = {
        ...transactionData,
        amount: num,
        type: transactionData.type === 'UNKNOWN_AMOUNT' ? 'Income' : transactionData.type,
        description: transactionData.description === 'No speech detected' || !transactionData.description
          ? 'Manual entry'
          : transactionData.description,
      };
      setTransactionData(updated);
      setIsEnteringManual(false);
    }
  };

  const isIncome = transactionData.type?.toLowerCase() === 'income';
  const hasNoAmount = transactionData.type === 'UNKNOWN_AMOUNT' || !transactionData.amount || transactionData.amount === 0;

  // If no amount was detected from audio
  if (hasNoAmount) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col p-6 sm:p-10 items-center text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4">
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('confirm_no_amount_title')}</h2>

          {transactionData.transcript ? (
            <div className="w-full bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 my-3 text-left">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                {t('confirm_heard_label') || 'I heard:'}
              </span>
              <p className="text-base font-semibold text-slate-800 italic mb-2">
                "{transactionData.transcript}"
              </p>
              <div className="text-xs text-slate-600 space-y-1">
                <p className="text-amber-900 font-medium">
                  I couldn't find the transaction amount.
                </p>
                <p>
                  {t('confirm_try_saying') || 'Try saying:'}{' '}
                  <span className="font-semibold text-slate-900">
                    "{t('confirm_try_saying_example') || 'Sold goods for 5000 naira'}"
                  </span>{' '}
                  or <span className="font-semibold text-slate-900">"I sell am 5k"</span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-600 mb-4 leading-relaxed text-sm">
              {t('confirm_no_amount_copy')}
            </p>
          )}

          {audioBase64 && (
            <button
              onClick={togglePlay}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all mb-3 text-sm"
            >
              <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="currentColor">
                {isPlaying ? (
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                ) : (
                  <path d="M8 5v14l11-7z" />
                )}
              </svg>
              <span>{isPlaying ? (t('confirm_pause_recording') || 'Pause Recording') : (t('confirm_play_recording') || 'Play Recording')}</span>
            </button>
          )}

          {isEnteringManual ? (
            <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 mb-3 text-left">
              <label htmlFor="manual-amount-input" className="text-xs font-bold text-slate-700 uppercase block mb-1">
                Transaction Amount (₦)
              </label>
              <div className="flex gap-2">
                <input
                  id="manual-amount-input"
                  type="number"
                  placeholder="e.g. 5000"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-base"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleApplyManualAmount}
                  className="bg-[#052e16] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#022c22] transition-all text-sm"
                >
                  Set
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsEnteringManual(true)}
              className="w-full mb-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-3.5 px-6 rounded-xl transition-all border border-emerald-200 text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>{t('confirm_enter_manually') || 'Enter Amount Manually'}</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('listeng')}
            className="w-full bg-[#052e16] hover:bg-[#022c22] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg active:scale-95 text-sm"
          >
            {t('confirm_record_again')}
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full mt-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all active:scale-95 text-sm"
          >
            {t('confirm_cancel')}
          </button>
        </div>
      </div>
    );
  }

  // Success Confirmation Screen
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 lg:p-12">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Side: Information Panel */}
        <div className="flex-1 p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-slate-50 to-slate-100 border-r border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => onNavigate('home')}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <h1 className="text-lg lg:text-xl font-bold text-slate-800">
              {t('confirm_title')}
            </h1>
            <div className="w-11 h-11"></div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {transactionData.transcript && (
              <div className="mb-6 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm text-left">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  {t('confirm_heard_label') || 'I heard:'}
                </span>
                <p className="text-base font-semibold text-slate-800 italic">
                  "{transactionData.transcript}"
                </p>
              </div>
            )}

            <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-100 flex gap-4 items-start text-left">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-600 shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900 mb-1">
                  {t('confirm_pin_required')}
                </h4>
                <p className="text-blue-700/80 text-xs leading-relaxed">
                  {t('confirm_pin_copy')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Transaction Card & Action */}
        <div className="flex-1 p-6 sm:p-10 lg:p-12 bg-white flex flex-col justify-between relative">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
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

            <div className="mb-8">
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase block mb-2">
                {t('pin_transaction_amount')}
              </span>
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
                ₦{Number(transactionData.amount).toLocaleString()}
              </h3>
            </div>

            <div className="h-px w-full bg-slate-100 mb-8" />

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <span className="text-xs font-bold text-slate-400 tracking-widest uppercase block mb-1">
                  {t('confirm_description')}
                </span>
                <span className="text-base font-bold text-slate-800 leading-tight block">
                  {transactionData.description}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 tracking-widest uppercase block mb-1">
                  {t('confirm_category')}
                </span>
                <span className="text-base font-bold text-slate-800 leading-tight block">
                  {transactionData.category}
                </span>
              </div>
            </div>
          </div>

          <div>
            {audioBase64 && (
              <button
                onClick={togglePlay}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all mb-3 z-20 relative active:scale-[0.98] text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  {isPlaying ? (
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  ) : (
                    <path d="M8 5v14l11-7z" />
                  )}
                </svg>
                <span>{isPlaying ? (t('confirm_pause_recording') || 'Pause Recording') : (t('confirm_play_recording') || 'Play Recording')}</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('pulse_trade_pin', { transactionData })}
              className="w-full bg-[#052e16] hover:bg-[#022c22] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-900/20 active:scale-[0.98] z-20 relative"
            >
              <span className="text-base tracking-wide">{t('confirm_button')}</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
