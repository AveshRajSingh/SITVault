import express from 'express';
import { 
    getNotifications, 
    getUnreadNotifications, 
    markAsRead, 
    createNotification,
    getVapidKey,
    subscribeToPush,
    unsubscribeFromPush,
    getPushSubscriptionStatus
} from '../controllers/notification.controller.js';
import verifyUser from '../middlewares/verifyUser.js';

const router = express.Router();

router.get('/', verifyUser, getNotifications);
router.get('/unread', verifyUser, getUnreadNotifications);
router.patch('/:id/read', verifyUser, markAsRead);
router.post('/', createNotification); // For admin/testing

// Push notification routes
router.get('/push/vapid-key', getVapidKey);
router.post('/push/subscribe', verifyUser, subscribeToPush);
router.post('/push/unsubscribe', verifyUser, unsubscribeFromPush);
router.get('/push/status', verifyUser, getPushSubscriptionStatus);

export default router;
