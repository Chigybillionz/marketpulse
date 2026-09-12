import { Mic2, TrendingUp, ShieldCheck } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

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
  headline,
  sub,
  features,
}) {
  const { t } = useLanguage();

  const displayHeadline = headline || t("flow_headline");
  const displaySub = sub || t("flow_subtitle");
  const displayFeatures = features || [
    { Icon: Mic2, label: t("flow_feature_voice") },
    { Icon: TrendingUp, label: t("flow_feature_pulse") },
    { Icon: ShieldCheck, label: t("flow_feature_security") },
  ];

  return (
    <div className="mp-flow">
      <aside className="mp-flow__aside">
        <div className="mp-flow-brand">
          <img
            className="mp-flow-brand__logo"
            src="/mylogo.png"
            alt={t("flow_brand_title") || "MarketPulse AI logo"}
          />
          {t("flow_brand_title") || "MarketPulse AI"}
        </div>
        <h1 className="mp-flow-headline">{displayHeadline}</h1>
        <p className="mp-flow-sub">{displaySub}</p>
        <div className="mp-flow-features">
          {displayFeatures.map(({ Icon, label }, idx) => (
            <div className="mp-flow-feature" key={idx}>
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
