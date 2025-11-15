// Service Worker for Push Notifications
// This file handles push notifications when the app is in the background

self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
    event.waitUntil(clients.claim());
});

// Handle push notifications
self.addEventListener('push', (event) => {
    console.log('Push notification received:', event);

    if (!event.data) {
        console.log('Push event has no data');
        return;
    }

    let notificationData;
    try {
        notificationData = event.data.json();
    } catch (error) {
        console.error('Error parsing push notification data:', error);
        notificationData = {
            title: 'New Notification',
            body: event.data.text() || 'You have a new notification',
        };
    }

    const {
        title = 'SitVault',
        body = '',
        icon = '/favicon.ico',
        badge = '/favicon.ico',
        data = {},
        tag = 'notification',
        requireInteraction = false,
    } = notificationData;

    const options = {
        body,
        icon,
        badge,
        data,
        tag,
        requireInteraction,
        vibrate: [200, 100, 200],
        actions: [
            {
                action: 'open',
                title: 'View',
            },
            {
                action: 'close',
                title: 'Dismiss',
            },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);
    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    // Handle navigation based on notification data
    const data = event.notification.data || {};
    let urlToOpen = '/';

    if (data.type === 'comment' && data.postId) {
        urlToOpen = `/post/${data.postId}`;
    } else if (data.type === 'reply' && data.commentId) {
        urlToOpen = `/post/${data.postId || ''}#comment-${data.commentId}`;
    } else if (data.url) {
        urlToOpen = data.url;
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if there's already a window open
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        client.focus();
                        client.postMessage({
                            type: 'NOTIFICATION_CLICKED',
                            data: data,
                            url: urlToOpen,
                        });
                        return;
                    }
                }
                // If no window is open, open a new one
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('Notification closed:', event);
});
