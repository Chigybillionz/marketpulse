import { useState } from 'react';
import { Menu, UserCircle } from 'lucide-react';
import MobileMenu from '../layout/MobileMenu';

export default function Header({ businessName, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '48px 20px 12px 20px',
        background: 'transparent',
      }}
    >
      {/* Left icon — opens the slide-in navigation menu */}
      <button
        onClick={() => setMenuOpen(true)}
        aria-label="Menu"
        aria-haspopup="dialog"
        aria-expanded={menuOpen}
        style={{
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
        }}
      >
        <Menu size={24} strokeWidth={2} color="#1a1a1a" />
      </button>

      {/* Center — Business Name */}
      <h1
        style={{
          flex: 1,
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 800,
          color: '#1a1a1a',
          letterSpacing: '-0.3px',
          margin: 0,
          padding: '0 8px',
          lineHeight: 1.2,
        }}
      >
        {businessName || 'My Store'}
      </h1>

      {/* Right icon — user circle */}
      <button
        onClick={() => onNavigate('profile')}
        aria-label="Profile"
        style={{
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
        }}
      >
        <UserCircle size={28} strokeWidth={1.5} color="#1a1a1a" />
      </button>
    </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
        businessName={businessName}
      />
    </>
  );
}
