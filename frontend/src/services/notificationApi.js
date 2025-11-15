import { api } from '../context/AuthContext';

/**
 * Get VAPID public key from server
 * @returns {Promise<string>} The VAPID public key
 */
export const getVapidPublicKey = async () => {
  try {
    const response = await api.get('/api/notifications/push/vapid-key');
    return response.data.publicKey;
  } catch (error) {
    console.error('Error fetching VAPID key:', error);
    throw error;
  }
};

/**
 * Subscribe to push notifications
 * @param {PushSubscription} subscription - The push subscription object
 * @returns {Promise<Object>}
 */
export const subscribeToPush = async (subscription) => {
  try {
    const response = await api.post('/api/notifications/push/subscribe', {
      subscription: subscription.toJSON(),
    });
    return response.data;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
};

/**
 * Unsubscribe from push notifications
 * @returns {Promise<Object>}
 */
export const unsubscribeFromPush = async () => {
  try {
    const response = await api.post('/api/notifications/push/unsubscribe');
    return response.data;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    throw error;
  }
};

/**
 * Get push notification subscription status
 * @returns {Promise<Object>}
 */
export const getPushSubscriptionStatus = async () => {
  try {
    const response = await api.get('/api/notifications/push/status');
    return response.data;
  } catch (error) {
    console.error('Error getting subscription status:', error);
    throw error;
  }
};

/**
 * Get all notifications
 * @returns {Promise<Array>}
 */
export const getNotifications = async () => {
  try {
    const response = await api.get('/api/notifications');
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Get unread notifications
 * @returns {Promise<Array>}
 */
export const getUnreadNotifications = async () => {
  try {
    const response = await api.get('/api/notifications/unread');
    return response.data;
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - The notification ID
 * @returns {Promise<Object>}
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.patch(`/api/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export default {
  getVapidPublicKey,
  subscribeToPush,
  unsubscribeFromPush,
  getPushSubscriptionStatus,
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
};
