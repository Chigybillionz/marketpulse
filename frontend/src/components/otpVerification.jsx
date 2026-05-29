import { useState } from 'react'

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

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

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M15 21v-6.2C15 9.6 18.9 6 24 6s9 3.6 9 8.8V21" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="12" y="20" width="24" height="20" rx="2.5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="24" cy="30" r="3" fill="currentColor" />
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

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function OtpVerification() {
  const [pin, setPin] = useState('')

  const addDigit = (digit) => {
    setPin((currentPin) => (currentPin.length < 4 ? `${currentPin}${digit}` : currentPin))
  }

  const removeDigit = () => {
    setPin((currentPin) => currentPin.slice(0, -1))
  }

  return (
    <main className="trade-pin-page" aria-label="Verify transaction PIN screen">
      <section className="trade-pin-phone">
        <header className="trade-pin-header">
          <div className="trade-pin-brand" aria-label="Mama Ngozi Provisions">
            <span className="trade-pin-store">
              <StoreIcon />
            </span>
            <span>Mama Ngozi Provisions</span>
          </div>

          <button className="trade-pin-close" type="button" aria-label="Close PIN verification">
            <CloseIcon />
          </button>
        </header>

        <section className="trade-pin-hero" aria-labelledby="trade-pin-title">
          <div className="trade-pin-lock-badge">
            <LockIcon />
          </div>

          <h1 id="trade-pin-title">Enter Trade PIN</h1>
          <p>
            Enter your 4-digit PIN to confirm this sale<br />of <strong>₦15,000.</strong>
          </p>
        </section>

        <div className="trade-pin-indicators" role="status" aria-label={`${pin.length} of 4 PIN digits entered`}>
          {[0, 1, 2, 3].map((index) => (
            <span className={index < pin.length ? 'filled' : ''} key={index} />
          ))}
        </div>

        <section className="trade-pin-keypad" aria-label="PIN keypad">
          {digits.map((digit) => (
            <button className="trade-pin-key" type="button" onClick={() => addDigit(digit)} key={digit}>
              {digit}
            </button>
          ))}
          <span className="trade-pin-empty" />
          <button className="trade-pin-key" type="button" onClick={() => addDigit('0')}>
            0
          </button>
          <button className="trade-pin-delete" type="button" onClick={removeDigit} aria-label="Delete last digit">
            <DeleteIcon />
          </button>
        </section>

        <footer className="trade-pin-footer">
          <a href="#forgot-pin">Forgot PIN?</a>
          <button className="trade-pin-confirm" type="button">
            <span>Confirm</span>
            <ArrowRightIcon />
          </button>
        </footer>
      </section>
    </main>
  )
}
