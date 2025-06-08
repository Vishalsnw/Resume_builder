// hooks/useNotification.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { z } from 'zod';
import { nanoid } from 'nanoid';

// Notification Schema
const NotificationSchema = z.object({
  id: z.string(),
  type: z.enum(['success', 'error', 'warning', 'info']),
  title: z.string(),
  message: z.string(),
  timestamp: z.string(),
  duration: z.number().optional(),
  action: z.object({
    label: z.string(),
    onClick: z.function(),
  }).optional(),
  isRead: z.boolean().default(false),
  metadata: z.record(z.unknown()).optional(),
});

type Notification = z.infer<typeof NotificationSchema>;
type NotificationType = Notification['type'];

interface NotificationOptions {
  maxNotifications?: number;
  defaultDuration?: number;
  persist?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

interface QueuedNotification extends Notification {
  timeoutId?: NodeJS.Timeout;
}

export function useNotification(options: NotificationOptions = {}) {
  const {
    maxNotifications = 5,
    defaultDuration = 5000,
    persist = false,
    position = 'top-right',
  } = options;

  const [notifications, setNotifications] = useState<QueuedNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const notificationQueue = useRef<QueuedNotification[]>([]);
  const websocketRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_NOTIFICATIONS_URL!);

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'notification') {
            showNotification({
              type: data.notificationType,
              title: data.title,
              message: data.message,
              metadata: data.metadata,
            });
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        setTimeout(connectWebSocket, 5000);
      };

      websocketRef.current = ws;
    };

    connectWebSocket();
    return () => websocketRef.current?.close();
  }, []);

  // Process notification queue
  const processQueue = useCallback(() => {
    if (notifications.length < maxNotifications && notificationQueue.current.length > 0) {
      const nextNotification = notificationQueue.current.shift();
      if (nextNotification) {
        setNotifications(prev => [...prev, nextNotification]);
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [notifications.length, maxNotifications]);

  // Show notification
  const showNotification = useCallback(({
    type,
    title,
    message,
    duration = defaultDuration,
    action,
    metadata,
  }: {
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
    action?: Notification['action'];
    metadata?: Record<string, unknown>;
  }) => {
    const notification: QueuedNotification = {
      id: nanoid(),
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      duration,
      action,
      isRead: false,
      metadata,
    };

    // Log notification
    logNotificationActivity(notification);

    if (notifications.length >= maxNotifications) {
      notificationQueue.current.push(notification);
    } else {
      setNotifications(prev => [...prev, notification]);
      setUnreadCount(prev => prev + 1);

      if (!persist && duration > 0) {
        const timeoutId = setTimeout(() => {
          removeNotification(notification.id);
        }, duration);
        notification.timeoutId = timeoutId;
      }
    }
  }, [notifications.length, maxNotifications, defaultDuration, persist]);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification?.timeoutId) {
        clearTimeout(notification.timeoutId);
      }
      return prev.filter(n => n.id !== id);
    });
    processQueue();
  }, [processQueue]);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications(prev => {
      prev.forEach(notification => {
        if (notification.timeoutId) {
          clearTimeout(notification.timeoutId);
        }
      });
      return [];
    });
    notificationQueue.current = [];
    setUnreadCount(0);
  }, []);

  // Helper functions for common notification types
  const success = useCallback((title: string, message: string, options = {}) => {
    showNotification({ type: 'success', title, message, ...options });
  }, [showNotification]);

  const error = useCallback((title: string, message: string, options = {}) => {
    showNotification({ type: 'error', title, message, ...options });
  }, [showNotification]);

  const warning = useCallback((title: string, message: string, options = {}) => {
    showNotification({ type: 'warning', title, message, ...options });
  }, [showNotification]);

  const info = useCallback((title: string, message: string, options = {}) => {
    showNotification({ type: 'info', title, message, ...options });
  }, [showNotification]);

  return {
    notifications,
    unreadCount,
    position,
    showNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    success,
    error,
    warning,
    info,
  };
}

// Helper function to log notification activity
async function logNotificationActivity(notification: Notification) {
  try {
    await fetch('/api/activity-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'NOTIFICATION_SHOW',
        description: `Showed ${notification.type} notification: ${notification.title}`,
        metadata: {
          notificationId: notification.id,
          type: notification.type,
          metadata: notification.metadata,
        },
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-08 07:12:52',
      }),
    });
  } catch (error) {
    console.error('Error logging notification activity:', error);
  }
}
