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
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '8px 8px 20px 8px',
        background: '#fff',
        borderTop: '1px solid #eee',
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
