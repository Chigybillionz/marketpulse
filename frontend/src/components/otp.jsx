const otpDigits = ['active', 'filled', 'filled', 'filled']

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

function ShieldLockIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M20 18.5 32 13l12 5.5v9.3c0 9.1-5.1 16.9-12 20.2-6.9-3.3-12-11.1-12-20.2v-9.3Z"
        fill="#8fb194"
      />
      <rect x="37" y="28" width="14" height="13" rx="2.4" fill="#8fb194" />
      <path d="M40 28v-3.1c0-2.4 1.7-4.4 4-4.4s4 2 4 4.4V28" fill="none" stroke="#8fb194" strokeWidth="3" strokeLinecap="round" />
      <circle cx="44" cy="34.6" r="1.6" fill="#052e16" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 18.8 3.6-.8L19 7.7 16.3 5 6 15.4l-1 3.4Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m14.8 6.6 2.7 2.7" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
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

export default function Otp({ onNavigate }) {
  return (
    <main className="otp-page" aria-label="OTP verification screen">
      <section className="otp-phone">
        <header className="otp-header">
          <div className="otp-brand" aria-label="Mama Ngozi Provisions">
            <span className="otp-store-icon">
              <StoreIcon />
            </span>
            <span>Mama Ngozi<br />Provisions</span>
          </div>

          <button 
            className="otp-close cursor-pointer" 
            type="button" 
            aria-label="Close verification"
            onClick={() => onNavigate('welcome')}
          >
            <CloseIcon />
          </button>
        </header>

        <section className="otp-content" aria-labelledby="otp-title">
          <div className="otp-security-badge">
            <ShieldLockIcon />
          </div>

          <h1 id="otp-title">Verification Code</h1>

          <p className="otp-instructions">
            Enter the 4-digit code sent to <strong>+234 803<br />000 0000</strong>
            <button 
              className="otp-edit cursor-pointer" 
              type="button" 
              aria-label="Edit phone number"
              onClick={() => onNavigate('welcome')}
            >
              <PencilIcon />
            </button>
          </p>

          <div className="otp-inputs" role="group" aria-label="Four digit verification code">
            {otpDigits.map((state, index) => (
              <button className={`otp-digit ${state}`} type="button" aria-label={`Digit ${index + 1}`} key={`${state}-${index}`}>
                {state === 'active' ? <span className="otp-cursor" /> : <span className="otp-dot" />}
              </button>
            ))}
          </div>

          <p className="otp-timer">Resend code in <strong>0:55</strong></p>

          <div className="otp-image" role="img" aria-label="Phone security screen inside a market store">
            <div className="otp-image-blur" />
            <div className="otp-phone-render">
              <div className="otp-phone-speaker" />
              <div className="otp-lock-symbol">⌐</div>
              <div className="otp-form-line" />
              <div className="otp-form-line short" />
              <div className="otp-phone-nav">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>

          <div className="otp-bottom">
            <button 
              className="otp-cta cursor-pointer" 
              type="button"
              onClick={() => onNavigate('home')}
            >
              <span>Verify &amp; Continue</span>
              <ArrowRightIcon />
            </button>

            <p className="otp-legal">
              By continuing, you agree to our <strong>Terms<br className="mobile-break" /> of Service</strong> and <strong>Privacy Policy.</strong>
            </p>
          </div>
        </section>
      </section>
    </main>
  )
}
