import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../api/axios";

export default function AdminNotifications() {

  const [notifications, setNotifications] = useState([]);

  const [form, setForm] = useState({
    title: "",
    message: "",
    targetRole: ""
  });

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  // Get notifications when page loads
  useEffect(() => {

    api.get("/notifications")
      .then((response) => {
        setNotifications(response.data);
      });

    // Mark existing notifications as read
    api.put("/notifications/mark-all-read");

  }, []);


  // Send announcement
  const handleSend = async (event) => {

    event.preventDefault();
    setSending(true);

    try {

      const response = await api.post(
        "/notifications/announce",
        form
      );

      setMessage(response.data.message);

      // Clear form
      setForm({
        title: "",
        message: "",
        targetRole: ""
      });

    } catch (error) {

      setMessage("Send failed");

    } finally {

      setSending(false);

    }
  };


  return (
    <AdminLayout
      pageTitle="Notifications"
      pageSubtitle="Send announcements and view alerts"
    >

      {/* Announcement form */}
      <div className="card">

        <h3>Send Announcement</h3>

        {message && <p>{message}</p>}

        <form onSubmit={handleSend}>

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value
              })
            }
          />

          <textarea
            placeholder="Message"
            value={form.message}
            onChange={(e) =>
              setForm({
                ...form,
                message: e.target.value
              })
            }
          />

          <select
            value={form.targetRole}
            onChange={(e) =>
              setForm({
                ...form,
                targetRole: e.target.value
              })
            }
          >
            <option value="">All Users & Technicians</option>
            <option value="user">Users Only</option>
            <option value="technician">Technicians Only</option>
          </select>

          <button type="submit" disabled={sending}>
            {sending ? "Sending..." : "Send"}
          </button>

        </form>

      </div>


      {/* Notifications list */}
      <div className="card">

        <h3>Recent Notifications</h3>

        {notifications.length === 0 ? (

          <p>No notifications yet.</p>

        ) : (

          notifications.map((notification) => (

            <div key={notification._id}>

              <h4>{notification.title}</h4>

              <p>{notification.message}</p>

              <small>
                {notification.createdAt}
              </small>

            </div>

          ))

        )}

      </div>

    </AdminLayout>
  );
}