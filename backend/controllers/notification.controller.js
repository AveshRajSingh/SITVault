import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';
import { getVapidPublicKey } from '../utilities/pushNotification.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

export const getUnreadNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id, isRead: false }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch unread notifications' });
    }
};

export const markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to mark as read' });
    }
};

export const createNotification = async (req, res) => {
    try {
        const notification = new Notification({
            user: req.body.user,
            message: req.body.message
        });
        await notification.save();
        // Emit real-time notification
        if (req.app.get('io')) {
            req.app.get('io').to(req.body.user).emit('notification', notification);
        }
        res.status(201).json(notification);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create notification' });
    }
};

// Push Notification Controllers
export const getVapidKey = async (req, res) => {
    try {
        const publicKey = getVapidPublicKey();
        if (!publicKey) {
            return res.status(500).json({ error: 'VAPID keys not configured' });
        }
        res.json({ publicKey });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get VAPID key' });
    }
};

export const subscribeToPush = async (req, res) => {
    try {
        const { subscription } = req.body;
        
        if (!subscription || !subscription.endpoint) {
            return res.status(400).json({ error: 'Invalid subscription data' });
        }

        await User.findByIdAndUpdate(req.user._id, {
            pushSubscription: subscription
        });

        res.json({ success: true, message: 'Successfully subscribed to push notifications' });
    } catch (err) {
        console.error('Subscribe to push error:', err);
        res.status(500).json({ error: 'Failed to subscribe to push notifications' });
    }
};

export const unsubscribeFromPush = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $unset: { pushSubscription: 1 }
        });

        res.json({ success: true, message: 'Successfully unsubscribed from push notifications' });
    } catch (err) {
        console.error('Unsubscribe from push error:', err);
        res.status(500).json({ error: 'Failed to unsubscribe from push notifications' });
    }
};

export const getPushSubscriptionStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('pushSubscription');
        res.json({ 
            subscribed: !!user.pushSubscription,
            subscription: user.pushSubscription || null
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get subscription status' });
    }
};
