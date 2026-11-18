import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function HomeServiceDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) {
  // Prevent background body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* ── Backdrop Overlay ── */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* ── Slide-Up Sheet Container ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 600,
          margin: '0 auto',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'mpSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <style>{`
          @keyframes mpSlideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>

        {/* ── Drawer Header / Drag Handle ── */}
        <div
          style={{
            padding: '14px 20px 12px 20px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          {/* Subtle Pull Indicator Pill */}
          <div
            style={{
              position: 'absolute',
              top: 6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 38,
              height: 4,
              borderRadius: 2,
              backgroundColor: '#cbd5e1',
            }}
          />

          <div style={{ marginTop: 4 }}>
            <h3
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
                letterSpacing: '-0.3px',
              }}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                style={{
                  fontSize: 12,
                  color: '#64748b',
                  margin: '2px 0 0',
                  fontWeight: 500,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              cursor: 'pointer',
              outline: 'none',
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Scrollable Sheet Content ── */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
