import React, { useState, useEffect } from 'react';
import { FiBell, FiBellOff, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  isPushNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  registerServiceWorker,
} from '../../utils/pushNotifications';
import {
  getVapidPublicKey,
  subscribeToPush,
  unsubscribeFromPush,
  getPushSubscriptionStatus,
} from '../../services/notificationApi';

const NotificationSettings = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    checkNotificationSupport();
    checkSubscriptionStatus();
  }, []);

  const checkNotificationSupport = () => {
    const supported = isPushNotificationSupported();
    setIsSupported(supported);
    if (supported) {
      setPermission(getNotificationPermission());
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      setIsCheckingStatus(true);
      const status = await getPushSubscriptionStatus();
      setIsSubscribed(status.subscribed);
    } catch (error) {
      console.error('Error checking subscription status:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleEnableNotifications = async () => {
    if (!isSupported) {
      toast.error('Push notifications are not supported in your browser');
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Request permission
      const permissionResult = await requestNotificationPermission();
      setPermission(permissionResult);

      if (permissionResult !== 'granted') {
        toast.error('Notification permission was denied');
        return;
      }

      // Step 2: Register service worker
      await registerServiceWorker();

      // Step 3: Get VAPID public key from server
      const vapidPublicKey = await getVapidPublicKey();

      // Step 4: Subscribe to push notifications
      const subscription = await subscribeToPushNotifications(vapidPublicKey);

      // Step 5: Send subscription to backend
      await subscribeToPush(subscription);

      setIsSubscribed(true);
      toast.success('Push notifications enabled successfully!');
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast.error('Failed to enable push notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setIsLoading(true);
    try {
      // Step 1: Unsubscribe from push notifications locally
      await unsubscribeFromPushNotifications();

      // Step 2: Notify backend
      await unsubscribeFromPush();

      setIsSubscribed(false);
      toast.success('Push notifications disabled successfully');
    } catch (error) {
      console.error('Error disabling notifications:', error);
      toast.error('Failed to disable push notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingStatus) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FiBell size={24} />
        Push Notifications
      </h3>

      {!isSupported ? (
        <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">
                Not Supported
              </h4>
              <p className="text-yellow-700 text-sm">
                Push notifications are not supported in your current browser. 
                Try using Chrome, Firefox, Edge, or Safari on a supported device.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status Card */}
          <div className={`border rounded-lg p-6 ${
            isSubscribed 
              ? 'bg-green-50 border-green-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  isSubscribed ? 'bg-green-100' : 'bg-gray-200'
                }`}>
                  {isSubscribed ? (
                    <FiBell className="text-green-600" size={24} />
                  ) : (
                    <FiBellOff className="text-gray-600" size={24} />
                  )}
                </div>
                <div>
                  <h4 className={`font-semibold mb-1 ${
                    isSubscribed ? 'text-green-800' : 'text-gray-800'
                  }`}>
                    {isSubscribed ? 'Notifications Enabled' : 'Notifications Disabled'}
                  </h4>
                  <p className={`text-sm ${
                    isSubscribed ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {isSubscribed 
                      ? "You'll receive push notifications for new comments, replies, and updates." 
                      : "Enable push notifications to stay updated with new activity."}
                  </p>
                </div>
              </div>
              
              {isSubscribed ? (
                <FiCheck className="text-green-600 flex-shrink-0" size={24} />
              ) : (
                <FiX className="text-gray-400 flex-shrink-0" size={24} />
              )}
            </div>
          </div>

          {/* Permission Status */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900 mb-1">
                  Browser Permission
                </h5>
                <p className="text-sm text-gray-600">
                  {isSubscribed && 'Permission granted'}
                  {!isSubscribed && 'Permission denied'}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isSubscribed
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isSubscribed ? 'Granted' : 'Denied'}
              </span>
            </div>
          </div>

          {/* What you'll receive */}
          {!isSubscribed && (
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h5 className="font-medium text-blue-900 mb-2">
                What you'll receive:
              </h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• New comments on your posts</li>
                <li>• Replies to your comments</li>
                <li>• Important updates and announcements</li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isSubscribed ? (
              <button
                onClick={handleEnableNotifications}
                disabled={isLoading || permission === 'denied'}
                className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enabling...
                  </>
                ) : (
                  <>
                    <FiBell size={18} />
                    Enable Notifications
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleDisableNotifications}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Disabling...
                  </>
                ) : (
                  <>
                    <FiBellOff size={18} />
                    Disable Notifications
                  </>
                )}
              </button>
            )}
          </div>

          {permission === 'denied' && (
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h5 className="font-semibold text-red-800 mb-1">
                    Permission Blocked
                  </h5>
                  <p className="text-red-700 text-sm">
                    You've blocked notifications for this site. To enable them, 
                    you'll need to change your browser settings and allow notifications 
                    for this website, then refresh the page.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
