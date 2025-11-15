// Push Notification Utilities

/**
 * Convert VAPID public key from base64 to Uint8Array
 * @param {string} base64String - The base64 encoded public key
 * @returns {Uint8Array}
 */
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * Register service worker
 * @returns {Promise<ServiceWorkerRegistration>}
 */
export async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        throw new Error('Service workers are not supported in this browser');
    }

    try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
        });
        console.log('Service Worker registered successfully:', registration);
        return registration;
    } catch (error) {
        console.error('Service Worker registration failed:', error);
        throw error;
    }
}

/**
 * Check if push notifications are supported
 * @returns {boolean}
 */
export function isPushNotificationSupported() {
    return 'serviceWorker' in navigator && 
           'PushManager' in window && 
           'Notification' in window;
}

/**
 * Get current notification permission status
 * @returns {NotificationPermission}
 */
export function getNotificationPermission() {
    if (!('Notification' in window)) {
        return 'denied';
    }
    return Notification.permission;
}

/**
 * Request notification permission from user
 * @returns {Promise<NotificationPermission>}
 */
export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        throw new Error('Notifications are not supported in this browser');
    }

    try {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
        return permission;
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        throw error;
    }
}

/**
 * Subscribe to push notifications
 * @param {string} vapidPublicKey - The VAPID public key from the server
 * @returns {Promise<PushSubscription>}
 */
export async function subscribeToPushNotifications(vapidPublicKey) {
    if (!isPushNotificationSupported()) {
        throw new Error('Push notifications are not supported');
    }

    try {
        // Get or register service worker
        let registration = await navigator.serviceWorker.ready;
        if (!registration) {
            registration = await registerServiceWorker();
        }

        // Check for existing subscription
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            // Create new subscription
            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey,
            });
            console.log('New push subscription created:', subscription);
        } else {
            console.log('Existing push subscription found:', subscription);
        }

        return subscription;
    } catch (error) {
        console.error('Error subscribing to push notifications:', error);
        throw error;
    }
}

/**
 * Unsubscribe from push notifications
 * @returns {Promise<boolean>}
 */
export async function unsubscribeFromPushNotifications() {
    if (!isPushNotificationSupported()) {
        return false;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            const successful = await subscription.unsubscribe();
            console.log('Unsubscribed from push notifications:', successful);
            return successful;
        }

        return true;
    } catch (error) {
        console.error('Error unsubscribing from push notifications:', error);
        throw error;
    }
}

/**
 * Get current push subscription
 * @returns {Promise<PushSubscription|null>}
 */
export async function getCurrentPushSubscription() {
    if (!isPushNotificationSupported()) {
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        return subscription;
    } catch (error) {
        console.error('Error getting push subscription:', error);
        return null;
    }
}

/**
 * Check if user is subscribed to push notifications
 * @returns {Promise<boolean>}
 */
export async function isPushSubscribed() {
    const subscription = await getCurrentPushSubscription();
    return subscription !== null;
}

/**
 * Listen for messages from service worker
 * @param {Function} callback - Callback function to handle messages
 */
export function listenToServiceWorkerMessages(callback) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'NOTIFICATION_CLICKED') {
                callback(event.data);
            }
        });
    }
}

/**
 * Show a local notification (for testing)
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 */
export async function showLocalNotification(title, options = {}) {
    if (!('Notification' in window)) {
        console.warn('Notifications not supported');
        return;
    }

    if (Notification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
            body: options.body || '',
            icon: options.icon || '/favicon.ico',
            badge: options.badge || '/favicon.ico',
            data: options.data || {},
            tag: options.tag || 'local-notification',
            ...options,
        });
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

export default {
    registerServiceWorker,
    isPushNotificationSupported,
    getNotificationPermission,
    requestNotificationPermission,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    getCurrentPushSubscription,
    isPushSubscribed,
    listenToServiceWorkerMessages,
    showLocalNotification,
};
