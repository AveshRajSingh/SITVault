import webPush from 'web-push';
import User from '../models/user.model.js';

// VAPID keys should be generated once and stored in .env
// Run: npx web-push generate-vapid-keys
// Add these to your .env file:
// VAPID_PUBLIC_KEY=your_public_key
// VAPID_PRIVATE_KEY=your_private_key
// VAPID_SUBJECT=mailto:your-email@example.com

// Configure web-push with VAPID details
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webPush.setVapidDetails(
        process.env.VAPID_SUBJECT || 'mailto:admin@sitvault.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

/**
 * Send push notification to a specific user
 * @param {String} userId - The user's MongoDB ID
 * @param {Object} payload - The notification payload
 * @returns {Promise<Boolean>} Success status
 */
export const sendPushNotification = async (userId, payload) => {
    try {
        const user = await User.findById(userId);
        
        if (!user || !user.pushSubscription) {
            console.log(`No push subscription found for user: ${userId}`);
            return false;
        }

        const notificationPayload = JSON.stringify({
            title: payload.title || 'SitVault Notification',
            body: payload.body || '',
            icon: payload.icon || '/favicon.ico',
            badge: payload.badge || '/favicon.ico',
            data: payload.data || {},
            tag: payload.tag || 'notification',
            requireInteraction: payload.requireInteraction || false,
        });

        await webPush.sendNotification(user.pushSubscription, notificationPayload);
        console.log(`Push notification sent to user: ${userId}`);
        return true;
    } catch (error) {
        console.error('Error sending push notification:', error);
        
        // If the subscription is invalid or expired, remove it
        if (error.statusCode === 410 || error.statusCode === 404) {
            await User.findByIdAndUpdate(userId, { 
                $unset: { pushSubscription: 1 } 
            });
            console.log(`Removed invalid subscription for user: ${userId}`);
        }
        
        return false;
    }
};

/**
 * Send push notification to multiple users
 * @param {Array<String>} userIds - Array of user MongoDB IDs
 * @param {Object} payload - The notification payload
 * @returns {Promise<Object>} Success/failure counts
 */
export const sendBulkPushNotifications = async (userIds, payload) => {
    const results = {
        success: 0,
        failed: 0,
        total: userIds.length
    };

    const promises = userIds.map(async (userId) => {
        const sent = await sendPushNotification(userId, payload);
        if (sent) {
            results.success++;
        } else {
            results.failed++;
        }
    });

    await Promise.allSettled(promises);
    
    console.log(`Bulk notification results: ${results.success}/${results.total} sent successfully`);
    return results;
};

/**
 * Get VAPID public key (safe to expose to frontend)
 * @returns {String} The public VAPID key
 */
export const getVapidPublicKey = () => {
    return process.env.VAPID_PUBLIC_KEY || '';
};

export default {
    sendPushNotification,
    sendBulkPushNotifications,
    getVapidPublicKey
};
