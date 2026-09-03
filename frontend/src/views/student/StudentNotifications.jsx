import { useEffect, useState } from 'react';
import client from '../../api/client';
import Alert from '../../components/common/Alert';

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const loadNotifications = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await client.get('/notifications');

      setNotifications(data.data || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to load notifications. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    setUpdatingId(notificationId);
    setError('');

    try {
      await client.patch(
        `/notifications/${notificationId}/read`
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                readAt: new Date().toISOString(),
              }
            : notification
        )
      );

      setUnreadCount((prev) =>
        Math.max(0, prev - 1)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to update this notification.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const markAllAsRead = async () => {
    setUpdatingId('all');
    setError('');

    try {
      await client.patch('/notifications/read-all');

      const now = new Date().toISOString();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          readAt: notification.readAt || now,
        }))
      );

      setUnreadCount(0);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to mark notifications as read.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* PAGE HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Stay updated with important announcements, payments,
            classes, and learning activities.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={updatingId === 'all'}
            className="rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updatingId === 'all'
              ? 'Updating...'
              : `Mark all as read (${unreadCount})`}
          </button>
        )}
      </div>

      <Alert type="error">
        {error}
      </Alert>

      {/* LOADING STATE */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-lg border border-gray-200 p-4"
            >
              <div className="mb-3 h-4 w-1/3 rounded bg-gray-200" />

              <div className="mb-2 h-3 w-full rounded bg-gray-100" />

              <div className="h-3 w-2/3 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      )}

      {/* NOTIFICATIONS LIST */}
      {!loading && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const isRead = Boolean(
              notification.readAt
            );

            return (
              <div
                key={notification.id}
                className={`rounded-lg border p-4 transition ${
                  isRead
                    ? 'border-gray-200 bg-white'
                    : 'border-blue-100 bg-blue-50/40'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    {/* TITLE */}
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-gray-900">
                        {notification.title ||
                          formatNotificationType(
                            notification.type
                          )}
                      </h2>

                      {!isRead && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          New
                        </span>
                      )}
                    </div>

                    {/* NOTIFICATION DATA */}
                    {getNotificationMessage(
                      notification
                    ) && (
                      <p className="whitespace-pre-line text-sm leading-6 text-gray-600">
                        {getNotificationMessage(
                          notification
                        )}
                      </p>
                    )}

                    {/* META */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      {notification.type && (
                        <span className="rounded bg-gray-100 px-2 py-1 font-medium uppercase tracking-wide text-gray-500">
                          {formatNotificationType(
                            notification.type
                          )}
                        </span>
                      )}

                      <span>
                        {formatDate(
                          notification.createdAt
                        )}
                      </span>
                    </div>
                  </div>

                  {/* MARK AS READ */}
                  {!isRead && (
                    <button
                      type="button"
                      onClick={() =>
                        markAsRead(
                          notification.id
                        )
                      }
                      disabled={
                        updatingId ===
                        notification.id
                      }
                      className="shrink-0 text-sm font-medium text-blue-700 transition hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updatingId ===
                      notification.id
                        ? 'Updating...'
                        : 'Mark as read'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading &&
        notifications.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm">
              🔔
            </div>

            <h2 className="text-base font-semibold text-gray-800">
              No notifications yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Important updates about your learning activities
              will appear here.
            </p>
          </div>
        )}
    </div>
  );
}


/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function formatNotificationType(type) {
  if (!type) {
    return 'Notification';
  }

  return String(type)
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}


function getNotificationMessage(notification) {
  const { data } = notification;

  if (!data) {
    return '';
  }

  /*
   * If backend later sends:
   *
   * data: {
   *   message: '...',
   * }
   *
   * or:
   *
   * data: {
   *   description: '...'
   * }
   */

  if (typeof data === 'object') {
    if (data.message) {
      return data.message;
    }

    if (data.description) {
      return data.description;
    }

    /*
     * Payment notification example
     */

    if (
      data.amount !== undefined
    ) {
      return `Amount: ${Number(
        data.amount
      ).toLocaleString()}`;
    }

    /*
     * Generic fallback
     */

    const values = Object.values(data)
      .filter(
        (value) =>
          typeof value === 'string' ||
          typeof value === 'number'
      )
      .map(String);

    return values.join(' · ');
  }

  /*
   * If data is stored as a JSON string
   */

  if (typeof data === 'string') {
    return data;
  }

  return '';
}


function formatDate(dateValue) {
  if (!dateValue) {
    return 'Recently';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  return date.toLocaleString();
}