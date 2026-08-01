import { Mic } from 'lucide-react';

export default function FloatingMic({ onNavigate, variant }) {
  return (
    <div
      className={variant === 'desktop' ? 'mp-fab-desktop' : undefined}
      style={{
        position: 'fixed',
        bottom: 100,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
      }}
    >
      <button
        onClick={() => onNavigate('listeng')}
        aria-label="Voice command"
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#0d3d22',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid #f4f6f4',
          boxShadow: '0 6px 20px rgba(5,46,22,0.45)',
          cursor: 'pointer',
          color: '#fff',
          padding: 0,
        }}
      >
        <Mic size={22} strokeWidth={2.2} />
      </button>
    </div>
  );
}
