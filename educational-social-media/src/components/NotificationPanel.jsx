import React, { useState, useEffect } from 'react';
import { FaTimes, FaBell, FaThumbsUp, FaComment, FaReply } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

// Alert component for showing popup notifications
const AlertMessage = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500); // Auto close after 4.5 seconds (matching fade animation)
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const getAlertIcon = () => {
    switch (type) {
      case 'POST_LIKE':
        return <FaThumbsUp />;
      case 'POST_COMMENT':
        return <FaComment />;
      case 'COMMENT_REPLY':
        return <FaReply />;
      default:
        return <FaBell />;
    }
  };

  const getAlertTitle = () => {
    switch (type) {
      case 'POST_LIKE':
        return 'New Like';
      case 'POST_COMMENT':
        return 'New Comment';
      case 'COMMENT_REPLY':
        return 'New Reply';
      default:
        return 'Notification';
    }
  };

  return (
    <div className="alert-notification">
      <div className="alert-icon">
        {getAlertIcon()}
      </div>
      <div className="alert-content">
        <h4 className="alert-title">{getAlertTitle()}</h4>
        <p className="alert-message">{message}</p>
      </div>
      <button className="alert-close" onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  );
};

const NotificationPanel = ({ notifications, markAsRead, markAllAsRead, onClose }) => {
  const [alert, setAlert] = useState(null);

  // Show alert when a new notification comes in
  useEffect(() => {
    // Check if there's a new unread notification
    const newNotification = notifications.find(n => !n.read && !n.alerted);
    
    if (newNotification) {
      // Mark this notification as alerted to prevent showing multiple times
      newNotification.alerted = true;
      
      setAlert({
        message: getNotificationMessage(newNotification),
        type: newNotification.type
      });
    }
  }, [notifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'POST_LIKE':
        return <FaThumbsUp className="text-blue-500" />;
      case 'POST_COMMENT':
        return <FaComment className="text-green-500" />;
      case 'COMMENT_REPLY':
        return <FaReply className="text-purple-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case 'POST_LIKE':
        return `${notification.senderUser} liked your post`;
      case 'POST_COMMENT':
        return `${notification.senderUser} commented on your post`;
      case 'COMMENT_REPLY':
        return `${notification.senderUser} replied to your comment`;
      default:
        return 'New notification';
    }
  };

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <>
      <div className="notification-panel">
        <div className="notification-header">
          <h3 className="notification-title">
            <FaBell className="mr-2" />
            Notifications
          </h3>
          <div className="notification-actions">
            <button 
              className="btn-link"
              onClick={markAllAsRead}
              disabled={notifications.every(n => n.read)}
            >
              Mark all as read
            </button>
            <button className="btn-icon" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>
        
        <div className="notification-list">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <p className="notification-message">
                    {getNotificationMessage(notification)}
                  </p>
                  <span className="notification-time">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-notifications">
              No notifications yet
            </div>
          )}
        </div>
      </div>
      
      {/* Alert Message Pop-up */}
      {alert && (
        <AlertMessage 
          message={alert.message} 
          type={alert.type} 
          onClose={closeAlert} 
        />
      )}
    </>
  );
};

export default NotificationPanel;