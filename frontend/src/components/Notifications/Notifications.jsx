import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getNotifications, 
  getUnreadNotifications, 
  markNotificationAsRead 
} from '../../services/notificationApi';
import { FiBell, FiMessageSquare, FiUser, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // Fetch notifications
  const fetchNotifications = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      const data = filter === 'unread' 
        ? await getUnreadNotifications() 
        : await getNotifications();
      
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Mark notification as read and handle navigation
  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);
        // Update local state
        setNotifications(prev => 
          prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n)
        );
      }

      // Navigate based on notification type
      if (notification.message.includes('commented on your post')) {
        // Extract post info if available or navigate to home
        navigate('/');
      } else if (notification.message.includes('replied to your comment')) {
        navigate('/');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      await Promise.all(
        unreadNotifications.map(n => markNotificationAsRead(n._id))
      );

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (message) => {
    if (message.includes('comment')) {
      return <FiMessageSquare className="text-blue-500" size={20} />;
    } else if (message.includes('follow')) {
      return <FiUser className="text-green-500" size={20} />;
    } else {
      return <FiBell className="text-orange-500" size={20} />;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FiBell className="text-orange-500" size={32} />
                Notifications
              </h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'You\'re all caught up!'
                }
              </p>
            </div>

            <button
              onClick={() => fetchNotifications(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={18} />
              Refresh
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-6 border-b border-gray-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                filter === 'all'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                filter === 'unread'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Mark All as Read Button */}
          {unreadCount > 0 && (
            <div className="mt-4">
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                <FiCheckCircle size={16} />
                Mark all as read
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <p className="mt-4 text-gray-600">Loading notifications...</p>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="text-center">
              <FiBell className="mx-auto text-gray-400" size={48} />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </h3>
              <p className="mt-2 text-gray-600">
                {filter === 'unread' 
                  ? 'You\'re all caught up! Check back later for new updates.'
                  : 'When someone interacts with your content, you\'ll see it here.'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-all hover:shadow-md border-l-4 ${
                  notification.isRead 
                    ? 'border-gray-200 opacity-75' 
                    : 'border-orange-500'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getNotificationIcon(notification.message)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${
                      notification.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'
                    }`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  {/* Unread Indicator */}
                  {!notification.isRead && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (if needed for pagination in future) */}
        {notifications.length > 0 && notifications.length >= 20 && (
          <div className="mt-6 text-center">
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
