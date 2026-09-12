import { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, Trash2, Package, AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  generateSummary,
} from '../../services/notificationService';

function timeAgo(dateStr, t) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return t ? t("notif_just_now") : 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return t ? t("notif_mins_ago", { mins: minutes }) : `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t ? t("notif_hours_ago", { hours: hours }) : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return t ? t("notif_days_ago", { days: days }) : `${days}d ago`;
  return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
}

function formatCurrency(n) {
  return `₦${Math.round(n || 0).toLocaleString('en-NG')}`;
}

export default function NotificationBell() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Lock mobile body scroll and block horizontal swipe when notification panel is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalOverscroll = document.body.style.overscrollBehavior;

    // Apply scroll lock on mobile screens
    if (window.innerWidth <= 640) {
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
    };
  }, [isOpen]);

  // Fetch unread count on mount and every 60s
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  // Client-side daily summary timer
  useEffect(() => {
    const checkScheduledSummary = () => {
      try {
        const settings = JSON.parse(localStorage.getItem('inventoryAlertSettings') || '{}');
        if (!settings.dailySummary) return;

        const summaryTime = settings.dailySummaryTime || '18:00';
        const today = new Date().toISOString().split('T')[0];
        const lastGenerated = localStorage.getItem('lastSummaryGenerated');

        // Already generated today
        if (lastGenerated === today) return;

        const now = new Date();
        const [hours, minutes] = summaryTime.split(':').map(Number);
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);

        // If current time is past the scheduled time and we haven't generated today
        if (now >= scheduledTime) {
          localStorage.setItem('lastSummaryGenerated', today);
          generateSummary()
            .then(() => {
              fetchUnreadCount();
              if (isOpen) fetchNotifications();
            })
            .catch((err) => console.error('Auto summary generation failed:', err));
        }
      } catch (e) {
        // Ignore parse errors
      }
    };

    // Check immediately on mount, then every minute
    checkScheduledSummary();
    const timer = setInterval(checkScheduledSummary, 60000);
    return () => clearInterval(timer);
  }, [isOpen]);

  async function fetchUnreadCount() {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.count || 0);
    } catch (err) {
      // Silent fail — don't break UI if backend is down
    }
  }

  async function fetchNotifications() {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleBellClick() {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
    setExpandedId(null);
  }

  async function handleMarkAsRead(id, e) {
    e?.stopPropagation();
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }

  async function handleDelete(id, e) {
    e?.stopPropagation();
    try {
      await deleteNotification(id);
      const deleted = notifications.find((n) => n._id === id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (deleted && !deleted.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }

  function handleNotificationClick(notification) {
    if (expandedId === notification._id) {
      setExpandedId(null);
    } else {
      setExpandedId(notification._id);
      if (!notification.read) {
        handleMarkAsRead(notification._id);
      }
    }
  }

  function renderSummaryData(data) {
    if (!data || !data.totalProducts) return null;

    return (
      <div className="notification-summary-data">
        <div className="notification-summary-stats">
          <div className="notification-stat">
            <span className="notification-stat-label">{t("notif_stat_products")}</span>
            <span className="notification-stat-value">{data.totalProducts}</span>
          </div>
          <div className="notification-stat">
            <span className="notification-stat-label">{t("notif_stat_units")}</span>
            <span className="notification-stat-value">{data.totalUnits?.toLocaleString()}</span>
          </div>
          <div className="notification-stat">
            <span className="notification-stat-label">{t("notif_stat_value")}</span>
            <span className="notification-stat-value">{formatCurrency(data.totalStockValue)}</span>
          </div>
          <div className="notification-stat">
            <span className="notification-stat-label">{t("notif_stat_low_stock")}</span>
            <span className="notification-stat-value" style={{ color: data.lowStockCount > 0 ? '#ef4444' : '#16a34a' }}>
              {data.lowStockCount === 1 ? t("notif_item", { count: data.lowStockCount }) : t("notif_items", { count: data.lowStockCount })}
            </span>
          </div>
        </div>

        {data.lowStockItems && data.lowStockItems.length > 0 && (
          <div className="notification-low-stock">
            <h4>
              <AlertTriangle size={14} />
              {t("notif_low_stock_title")}
            </h4>
            <ul>
              {data.lowStockItems.map((item, i) => (
                <li key={i}>
                  <span className="notification-item-name">{item.name}</span>
                  <span className="notification-item-qty">{t("notif_items_left", { count: item.quantityInStock })}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="notification-bell-wrapper" ref={panelRef}>
      <button
        className="notification-bell-btn"
        onClick={handleBellClick}
        aria-label={`${t("notif_title")}${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
      >
        <Bell size={22} strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="notification-backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="notification-panel"
            role="region"
            aria-label={t("notif_title")}
          >
            <div className="notification-panel-header">
              <h3>{t("notif_title")}</h3>
              <div className="notification-panel-actions">
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="notification-mark-all" title={t("notif_read_all")}>
                    <CheckCheck size={16} />
                    <span>{t("notif_read_all")}</span>
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="notification-close-btn" title={t("common_close")}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="notification-panel-body">
              {loading ? (
                <div className="notification-empty">
                  <div className="notification-spinner" />
                  <p>{t("notif_loading")}</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="notification-empty">
                  <Bell size={40} strokeWidth={1.2} />
                  <p>{t("notif_empty_title")}</p>
                  <span>{t("notif_empty_desc")}</span>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`notification-item ${!notification.read ? 'unread' : ''} ${expandedId === notification._id ? 'expanded' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-item-row">
                      <div className="notification-item-icon">
                        {notification.type === 'daily_summary' ? (
                          <Package size={18} />
                        ) : notification.type === 'low_stock' ? (
                          <AlertTriangle size={18} />
                        ) : (
                          <Bell size={18} />
                        )}
                      </div>
                      <div className="notification-item-content">
                        <h4>{notification.type === 'daily_summary' ? t("notif_daily_summary_title") : notification.title}</h4>
                        <p>
                          {notification.type === 'daily_summary' && notification.data?.totalProducts !== undefined
                            ? t("notif_daily_summary_msg", { products: notification.data.totalProducts, units: (notification.data.totalUnits || 0).toLocaleString() })
                            : notification.message}
                        </p>
                        <span className="notification-item-time">{timeAgo(notification.createdAt, t)}</span>
                      </div>
                      <div className="notification-item-actions">
                        {!notification.read && (
                          <button onClick={(e) => handleMarkAsRead(notification._id, e)} title={t("notif_mark_read")}>
                            <Check size={14} />
                          </button>
                        )}
                        <button onClick={(e) => handleDelete(notification._id, e)} title={t("notif_delete")} className="notification-delete-btn">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {expandedId === notification._id && notification.data && (
                      renderSummaryData(notification.data)
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
