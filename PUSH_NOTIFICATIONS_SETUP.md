# Web Push Notifications Setup Guide

## Overview
This guide will help you set up web push notifications for SitVault application.

## Backend Setup

### 1. Generate VAPID Keys
VAPID (Voluntary Application Server Identification) keys are required for web push notifications.

Run this command in the backend directory:
```bash
cd backend
npx web-push generate-vapid-keys
```

This will output something like:
```
=======================================

Public Key:
BEl62iUYgUivxIkv69yViEuiBIa-Ib27SBlue03yEGHdRdZ8vzI...

Private Key:
4Uh9QwZxF6rHFkr0pGZPi_oLhAXvQCNwhX1_P8mT...

=======================================
```

### 2. Add Keys to Environment Variables
Add the generated keys to your `backend/.env` file:

```env
# Web Push Notifications
VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
VAPID_SUBJECT=mailto:your-email@example.com
```

Replace:
- `your_public_key_here` with the Public Key from step 1
- `your_private_key_here` with the Private Key from step 1
- `your-email@example.com` with your contact email

### 3. Backend Files Created
The following files have been created/modified:
- ✅ `backend/utilities/pushNotification.js` - Push notification service
- ✅ `backend/models/user.model.js` - Added `pushSubscription` field
- ✅ `backend/controllers/notification.controller.js` - Added push endpoints
- ✅ `backend/routes/notification.route.js` - Added push routes
- ✅ `backend/controllers/comment.controller.js` - Integrated push notifications on comment events

### 4. Available Backend Endpoints
- `GET /api/notifications/push/vapid-key` - Get public VAPID key
- `POST /api/notifications/push/subscribe` - Subscribe to push notifications
- `POST /api/notifications/push/unsubscribe` - Unsubscribe from push notifications
- `GET /api/notifications/push/status` - Get subscription status

## Frontend Setup

### 1. Service Worker
The service worker is located at:
- ✅ `frontend/public/sw.js`

It handles:
- Push notification events
- Notification clicks
- Background message handling

### 2. Frontend Files Created
- ✅ `frontend/src/utils/pushNotifications.js` - Push notification utilities
- ✅ `frontend/src/services/notificationApi.js` - API service for notifications
- ✅ `frontend/src/components/Settings/NotificationSettings.jsx` - UI component
- ✅ Updated `frontend/src/components/Settings/Settings.jsx` - Added notifications tab

### 3. How It Works

**For Users:**
1. Go to Settings → Notifications tab
2. Click "Enable Notifications" button
3. Browser will prompt for permission
4. Once granted, they'll receive push notifications

**For Developers:**
The notification flow is:
1. User enables notifications in Settings
2. Browser requests permission
3. Service worker registers with browser's push service
4. Subscription sent to backend and stored in user model
5. Backend sends push notifications on events (comments, replies, etc.)

## Testing

### Test Push Notifications

1. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Enable notifications:**
   - Login to your account
   - Go to Settings → Notifications
   - Click "Enable Notifications"
   - Grant permission when prompted

4. **Trigger a notification:**
   - Have another user comment on your post
   - You should receive a push notification

## Adding Push Notifications to Other Events

To add push notifications to other events, follow this pattern:

```javascript
import { sendPushNotification } from '../utilities/pushNotification.js';
import Notification from '../models/notification.model.js';

// In your controller
async function someAction(req, res) {
  // ... your code ...
  
  // Create in-app notification
  const notification = await Notification.create({
    user: targetUserId,
    message: 'Your notification message'
  });
  
  // Send push notification
  await sendPushNotification(targetUserId, {
    title: 'Notification Title',
    body: 'Notification message',
    data: {
      type: 'event-type',
      id: 'relevant-id'
    }
  });
  
  // ... rest of your code ...
}
```

## Browser Support

Push notifications are supported in:
- ✅ Chrome 42+
- ✅ Firefox 44+
- ✅ Edge 17+
- ✅ Safari 16+ (macOS 13+, iOS 16.4+)
- ✅ Opera 29+

**Note:** Push notifications don't work on:
- iOS Safari (before iOS 16.4)
- Private/Incognito browsing mode in some browsers

## Troubleshooting

### Notifications Not Appearing
1. Check browser permission (should be "granted")
2. Verify VAPID keys are correctly set in `.env`
3. Check browser console for errors
4. Ensure service worker is registered (check DevTools → Application → Service Workers)

### Subscription Fails
1. Verify the service worker is accessible at `/sw.js`
2. Check that HTTPS is enabled (required for service workers in production)
3. Verify VAPID public key matches between frontend and backend

### Database Issues
If you get errors about `pushSubscription`:
```bash
# The user model has been updated, restart your backend
cd backend
npm run dev
```

## Security Notes

1. **Never expose your VAPID private key** - Keep it in `.env` and never commit it
2. **Use HTTPS in production** - Service workers require HTTPS
3. **Validate subscriptions** - The backend validates user authentication before storing subscriptions

## Production Deployment

### Backend (Vercel/Render/etc.)
Add environment variables:
```
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_SUBJECT=mailto:your-email@example.com
```

### Frontend
Ensure the service worker is properly served:
- The `sw.js` file should be in the `public` folder
- It will be accessible at `https://yourdomain.com/sw.js`

## Next Steps

You can now:
1. ✅ Enable notifications in Settings
2. ✅ Receive push notifications for comments and replies
3. Add notifications to more events (posts, likes, etc.)
4. Customize notification appearance and behavior
5. Add action buttons to notifications

## Support

If you encounter any issues, check:
1. Browser console for errors
2. Service worker status in DevTools
3. Backend logs for push notification errors
4. VAPID keys are correctly configured
