import { useState } from 'react';
import { Menu, UserCircle } from 'lucide-react';
import MobileMenu from '../layout/MobileMenu';
import NotificationBell from './NotificationBell';
import { useLanguage } from '../../i18n/LanguageContext';

export default function Header({ businessName, onNavigate, profilePicture }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pic = profilePicture || localStorage.getItem('profilePicture');
  const { t } = useLanguage();

  return (
    <>
      <header
        className="mobile-only-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'max(44px, env(safe-area-inset-top, 44px)) 20px 12px 20px',
          background: 'rgba(238, 241, 247, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
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
          {businessName || t('common_my_store') || 'My Store'}
        </h1>

        {/* Notification Bell */}
        <NotificationBell />

        {/* Right icon — profile picture or fallback */}
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
            borderRadius: '50%',
            overflow: 'hidden',
          }}
        >
          {pic ? (
            <img
              src={pic}
              alt="Profile"
              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <UserCircle size={28} strokeWidth={1.5} color="#1a1a1a" />
          )}
        </button>
      </header>

      {/* Spacer so page content does not get hidden behind the stagnant fixed top navbar on mobile */}
      <div
        className="mobile-only-header-spacer"
        aria-hidden="true"
        style={{
          height: 'calc(max(44px, env(safe-area-inset-top, 44px)) + 48px)',
          width: '100%',
          flexShrink: 0,
        }}
      />

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
        businessName={businessName}
      />
    </>
  );
}
