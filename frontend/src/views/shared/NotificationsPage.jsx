import { useEffect, useState } from 'react';
import { notificationsApi } from '../../api/admin';

const TYPE_LABELS = {
  NEW_LIVE_CLASS: 'New Live Class',
  UPCOMING_LIVE_CLASS: 'Upcoming Live Class',
  NEW_RECORDING: 'New Recording',
  NEW_QUIZ: 'New Quiz',
  NEW_ASSIGNMENT: 'New Assignment',
  ASSIGNMENT_DEADLINE: 'Assignment Deadline',
  QUIZ_RESULT: 'Quiz Result',
  ASSIGNMENT_RESULT: 'Assignment Result',
  PAYMENT_CONFIRMATION: 'Payment',
  SUBSCRIPTION_EXPIRY: 'Subscription',
  NEW_ANNOUNCEMENT: 'Announcement',
  ACCOUNT_SECURITY: 'Account',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = () => {
    notificationsApi.list().then(({ data }) => {
      setNotifications(data.data);
      setUnreadCount(data.unreadCount);
    }).catch(() => {});
  };

  useEffect(load, []);

  const handleMarkRead = async (id) => {
    await notificationsApi.markRead(id).catch(() => {});
    load();
  };

  const handleMarkAllRead = async () => {
    await notificationsApi.markAllRead().catch(() => {});
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Notifications {unreadCount > 0 && <span className="text-sm text-blue-700 font-normal">({unreadCount} unread)</span>}
        </h1>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="text-sm text-blue-700 font-medium">
            Mark all as read
          </button>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => !n.readAt && handleMarkRead(n.id)}
            className={`w-full text-left p-4 ${!n.readAt ? 'bg-blue-50/50' : ''}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                {TYPE_LABELS[n.type] || n.type}
              </span>
              {!n.readAt && <span className="w-2 h-2 rounded-full bg-blue-600" />}
            </div>
            <p className="text-sm text-gray-900">{n.title}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
          </button>
        ))}
        {notifications.length === 0 && (
          <p className="text-sm text-gray-500 p-6 text-center">No notifications yet.</p>
        )}
      </div>
    </div>
  );
}
