import { Mic2, TrendingUp, ShieldCheck } from "lucide-react";

const DEFAULT_FEATURES = [
  { Icon: Mic2, label: "Log sales by voice — no typing" },
  { Icon: TrendingUp, label: "Weekly Pulse market insights" },
  { Icon: ShieldCheck, label: "Protect Your Business" },
];

/**
 * Layout wrapper for single-focus flow screens (Welcome / OTP / PIN…).
 *
 * - Mobile: renders the screen as a centered full-height column, exactly
 *   like before.
 * - Desktop (>=960px): a branded split layout — a marketing panel on the
 *   left, and the screen content presented as a clean card on the right.
 *
 * The child screen's outer element should carry the `mp-flow__card` class.
 */
export default function FlowLayout({
  children,
  headline = "Welcome to MarketPulse AI",
  sub = "The voice-first companion that helps Nigerian traders track sales, manage credit, and read the market — all from one place.",
  features = DEFAULT_FEATURES,
}) {
  return (
    <div className="mp-flow">
      <aside className="mp-flow__aside">
        <div className="mp-flow-brand">
          <img
            className="mp-flow-brand__logo"
            src="/mylogo.png"
            alt="MarketPulse AI logo"
          />
          MarketPulse AI
        </div>
        <h1 className="mp-flow-headline">{headline}</h1>
        <p className="mp-flow-sub">{sub}</p>
        <div className="mp-flow-features">
          {features.map(({ Icon, label }) => (
            <div className="mp-flow-feature" key={label}>
              <span className="mp-flow-ico">
                <Icon size={21} strokeWidth={2} />
              </span>
              {label}
            </div>
          ))}
        </div>
      </aside>

      <div className="mp-flow__stage">{children}</div>
    </div>
  );
}
