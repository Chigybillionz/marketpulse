import { ShoppingBag, CreditCard, Zap } from 'lucide-react';

export default function TransactionList({ transactionsList, onNavigate }) {
  const getIcon = (type) => {
    switch (type) {
      case 'bag':     return <ShoppingBag size={18} strokeWidth={2} />;
      case 'receipt': return <CreditCard  size={18} strokeWidth={2} />;
      case 'bolt':    return <Zap         size={18} strokeWidth={2} />;
      default:        return <ShoppingBag size={18} strokeWidth={2} />;
    }
  };

  // Map icon type to icon container styles
  const iconStyles = {
    bag:     { background: '#e8f5e9', color: '#2e7d32' },
    receipt: { background: '#e8ede8', color: '#0d3d22' },
    bolt:    { background: '#ffebee', color: '#c62828' },
  };

  return (
    <section style={{ padding: '8px 20px 16px 20px' }}>

      {/* Header row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: 0, letterSpacing: '-0.3px' }}>
          Recent Activity
        </h3>
        <button
          onClick={() => onNavigate('history')}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#1a7a3f',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          View All
        </button>
      </div>

      {/* Transaction items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {transactionsList.map((item) => {
          const iStyle = iconStyles[item.icon] || iconStyles.bag;

          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#fff',
                borderRadius: 18,
                padding: '14px 16px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
              }}
            >
              {/* Icon container */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: iStyle.background,
                  color: iStyle.color,
                }}
              >
                {getIcon(item.icon)}
              </div>

              {/* Text area */}
              <div style={{ flex: 1, minWidth: 0, marginLeft: 12 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#1a1a1a',
                    margin: 0,
                    lineHeight: 1.3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.title}
                </p>
                <p style={{ fontSize: 12, color: '#aaa', margin: '2px 0 0', fontWeight: 500 }}>
                  {item.meta}
                </p>
              </div>

              {/* Amount */}
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  flexShrink: 0,
                  marginLeft: 10,
                  color: item.isPositive ? '#1a7a3f' : '#d32f2f',
                  letterSpacing: '-0.3px',
                }}
              >
                {item.amount}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
