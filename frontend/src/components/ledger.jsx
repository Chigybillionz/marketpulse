import { useState } from 'react'

const keypadNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

function BackArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="m12 5-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 32 24" aria-hidden="true">
      <path
        d="M11 4h15c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H11l-7-8 7-8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="m16 8 7 8M23 8l-7 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function GoldenLock() {
  return (
    <div className="ledger-lock-card" aria-hidden="true">
      <div className="ledger-lock-shackle" />
      <div className="ledger-lock-body">
        <span />
      </div>
    </div>
  )
}

export default function Ledger() {
  const [pin, setPin] = useState('')
  const isComplete = pin.length === 4

  const addDigit = (digit) => {
    setPin((currentPin) => (currentPin.length < 4 ? `${currentPin}${digit}` : currentPin))
  }

  const removeDigit = () => {
    setPin((currentPin) => currentPin.slice(0, -1))
  }

  return (
    <main className="ledger-page" aria-label="Secure ledger PIN setup">
      <section className="ledger-phone">
        <header className="ledger-nav">
          <button type="button" className="ledger-back" aria-label="Go back">
            <BackArrowIcon />
          </button>
          <h1>MarketPulse AI</h1>
          <span className="ledger-nav-spacer" />
        </header>

        <section className="ledger-hero" aria-labelledby="ledger-title">
          <div className="ledger-security-orb">
            <GoldenLock />
          </div>

          <h2 id="ledger-title">Secure Your Ledger</h2>
          <p>Set a 4-digit Trade PIN to authorize sales, expenses, and credit entries.</p>
        </section>

        <div className="ledger-pin-indicators" role="status" aria-label={`${pin.length} of 4 PIN digits entered`}>
          {[0, 1, 2, 3].map((index) => (
            <span className={index < pin.length ? 'filled' : ''} key={index} />
          ))}
        </div>

        <section className="ledger-keypad" aria-label="PIN keypad">
          {keypadNumbers.map((digit) => (
            <button type="button" className="ledger-key" onClick={() => addDigit(digit)} key={digit}>
              {digit}
            </button>
          ))}
          <span className="ledger-key-empty" />
          <button type="button" className="ledger-key" onClick={() => addDigit('0')}>
            0
          </button>
          <button type="button" className="ledger-delete" onClick={removeDigit} aria-label="Delete last digit">
            <DeleteIcon />
          </button>
        </section>

        <button type="button" className={`ledger-cta ${isComplete ? 'active' : ''}`} disabled={!isComplete}>
          Set Secure PIN
        </button>
      </section>
    </main>
  )
}
