import { Home, Mic2, History, CreditCard } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'home',         label: 'Home',    Icon: Home       },
  { key: 'listeng',      label: 'Pulse',   Icon: Mic2       },
  { key: 'history',      label: 'History', Icon: History    },
  { key: 'credit',       label: 'Credit',  Icon: CreditCard },
];

export default function NavigationBar({ onNavigate, currentPage }) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        width: '100%',
        maxWidth: 768,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '14px 8px 24px 8px',
        background: 'rgba(255, 255, 255, 0.98)',
        borderTop: '1px solid #eee',
        boxShadow: '0 -8px 24px rgba(20, 33, 43, 0.04)',
      }}
    >
      {NAV_ITEMS.map(({ key, label, Icon }) => {
        const active = currentPage === key;
        return (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              flex: 1,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {/* Icon pill */}
            <div
              style={{
                width: 48,
                height: 32,
                borderRadius: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: active ? '#0d3d22' : 'transparent',
                transition: 'background 0.2s',
              }}
            >
              <Icon
                size={20}
                strokeWidth={2}
                color={active ? '#fff' : '#999'}
              />
            </div>
            {/* Label */}
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: active ? '#0d3d22' : '#999',
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
