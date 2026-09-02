import { useEffect, useState } from "react";
import TechnicianLayout from "../../components/layout/TechnicianLayout";
import api from "../../api/axios";
import { formatDateTime } from "../../utils/helpers";
import "../../styles/global.css";
import "../../styles/dashboard.css";

export default function TechNotifications() {

  // Store all notifications
  const [notifications, setNotifications] = useState([]);

  // Track loading state
  const [loading, setLoading] = useState(true);


  // Get notifications when page loads
  useEffect(() => {

    api.get("/notifications")
      .then((response) => {

        setNotifications(response.data);

      })
      .finally(() => {

        setLoading(false);

      });


    // Mark all notifications as read
    api.put("/notifications/mark-all-read")
      .catch(() => {});

  }, []);


  // Mark one notification as read
  const markAsRead = async (id) => {

    await api.put(`/notifications/${id}/read`);


    // Update that notification in the frontend
    setNotifications((oldNotifications) => {

      return oldNotifications.map((notification) => {

        if (notification._id === id) {

          return {
            ...notification,
            isRead: true
          };

        }

        return notification;

      });

    });
  };


  // Mark all notifications as read
  const markAllAsRead = () => {

    // Update backend
    api.put("/notifications/mark-all-read");


    // Update frontend
    setNotifications((oldNotifications) => {

      return oldNotifications.map((notification) => {

        return {
          ...notification,
          isRead: true
        };

      });

    });
  };


  return (

    <TechnicianLayout
      pageTitle="Notifications"
      pageSubtitle="Task assignments and updates"
    >

      {/* Loading */}
      {loading && (

        <div className="loading-spinner">

          <div className="spinner"></div>

        </div>

      )}


      {/* No notifications */}
      {!loading && notifications.length === 0 && (

        <div className="empty-state">

          <h3>
            No notifications
          </h3>

          <p>
            You will be notified here when new tasks
            are assigned to you.
          </p>

        </div>

      )}


      {/* Notifications */}
      {!loading && notifications.length > 0 && (

        <div
          className="card"
          style={{
            padding: 0,
            overflow: "hidden"
          }}
        >

          {/* Header */}

          <div className="table-header-bar">

            <h3>
              All Notifications ({notifications.length})
            </h3>

            <button
              className="btn btn-secondary btn-sm"
              onClick={markAllAsRead}
            >
              Mark All Read
            </button>

          </div>


          {/* Notification list */}

          {notifications.map((notification) => (

            <div
              key={notification._id}
              className={
                `notif-item ${
                  !notification.isRead ? "unread" : ""
                }`
              }
              onClick={() => {

                if (!notification.isRead) {
                  markAsRead(notification._id);
                }

              }}
              style={{
                cursor: notification.isRead
                  ? "default"
                  : "pointer"
              }}
            >

              {/* Title and unread indicator */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start"
                }}
              >

                <div className="notif-title">
                  {notification.title}
                </div>


                {/* Show dot if unread */}

                {!notification.isRead && (

                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--color-primary)"
                    }}
                  />

                )}

              </div>


              {/* Message */}

              <div className="notif-msg">
                {notification.message}
              </div>


              {/* Date */}

              <div className="notif-time">
                {formatDateTime(
                  notification.createdAt
                )}
              </div>

            </div>

          ))}

        </div>

      )}

    </TechnicianLayout>

  );
}