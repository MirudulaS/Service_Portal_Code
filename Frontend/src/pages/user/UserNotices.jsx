import { useEffect, useState } from "react";
import UserLayout from "../../components/layout/UserLayout";
import api from "../../api/axios";
import { formatDateTime } from "../../utils/helpers";
import "../../styles/global.css";
import "../../styles/dashboard.css";

export default function UserNotices() {

  // Store notices
  const [notices, setNotices] = useState([]);

  // Track loading
  const [loading, setLoading] = useState(true);


  // Get notices when page loads
  useEffect(() => {

    api.get("/notices")
      .then((response) => {

        setNotices(response.data);

      })
      .finally(() => {

        setLoading(false);

      });

  }, []);


  return (

    <UserLayout
      pageTitle="Notice Board"
      pageSubtitle="Official announcements from administration"
    >

      {/* Loading */}

      {loading && (

        <div className="loading-spinner">

          <div className="spinner"></div>

        </div>

      )}


      {/* No notices */}

      {!loading && notices.length === 0 && (

        <div className="empty-state">

          <h3>
            No notices posted
          </h3>

          <p>
            Check back later for announcements
            from the administration.
          </p>

        </div>

      )}


      {/* Display notices */}

      {!loading && notices.length > 0 && (

        <div>

          {notices.map((notice) => (

            <div
              key={notice._id}
              className={`notice-card ${
                notice.priority?.toLowerCase()
              }`}
            >

              {/* Notice title and priority */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start"
                }}
              >

                <div className="notice-title">
                  {notice.title}
                </div>


                {/* Priority badge */}

                <span
                  className={
                    notice.priority === "Urgent"
                      ? "badge badge-urgent"
                      : notice.priority === "Important"
                      ? "badge badge-medium"
                      : "badge badge-normal"
                  }
                >
                  {notice.priority}
                </span>

              </div>


              {/* Notice content */}

              <div className="notice-body">
                {notice.content}
              </div>


              {/* Notice information */}

              <div className="notice-meta">

                Posted by{" "}
                {notice.postedBy?.name}

                {" · "}

                {formatDateTime(
                  notice.createdAt
                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </UserLayout>

  );
}