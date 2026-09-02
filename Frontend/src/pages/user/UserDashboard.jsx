import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../components/layout/UserLayout";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/helpers";
import "../../styles/global.css";

export default function UserDashboard() {

  // Get logged-in user
  const { user } = useAuth();

  // Used for page navigation
  const navigate = useNavigate();


  // Store user's requests
  const [requests, setRequests] = useState([]);

  // Track loading
  const [loading, setLoading] = useState(true);


  // Get user's requests when dashboard loads
  useEffect(() => {

    api.get("/requests/my")
      .then((response) => {

        setRequests(response.data);

      })
      .finally(() => {

        setLoading(false);

      });

  }, []);


  // Calculate request counts

  const totalRequests = requests.length;


  const pendingRequests = requests.filter((request) => {

    return request.status === "Pending";

  }).length;


  const inProgressRequests = requests.filter((request) => {

    return (
      request.status === "Assigned" ||
      request.status === "In Progress"
    );

  }).length;


  const completedRequests = requests.filter((request) => {

    return request.status === "Completed";

  }).length;


  return (

    <UserLayout
      pageTitle="Dashboard"
      pageSubtitle={`Hello, ${user?.name}`}
    >

      {/* Summary cards */}

      <div className="grid-4">

        <div className="stat-card">

          <div className="stat-label">
            Total Submitted
          </div>

          <div className="stat-value">
            {totalRequests}
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-label">
            Pending
          </div>

          <div className="stat-value">
            {pendingRequests}
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-label">
            In Progress
          </div>

          <div className="stat-value">
            {inProgressRequests}
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-label">
            Completed
          </div>

          <div className="stat-value">
            {completedRequests}
          </div>

        </div>

      </div>


      {/* Recent requests */}

      <div className="card">

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >

          <h3>
            Recent Requests
          </h3>


          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              navigate("/user/submit-request")
            }
          >
            + New Request
          </button>

        </div>


        {/* Loading */}

        {loading && (

          <div className="loading-spinner">

            <div className="spinner"></div>

          </div>

        )}


        {/* No requests */}

        {!loading && requests.length === 0 && (

          <div className="empty-state">

            <p>
              No requests yet.
              Submit your first request!
            </p>

          </div>

        )}


        {/* Show recent requests */}

        {!loading && requests.length > 0 && (

          <div>

            {requests
              .slice(0, 5)
              .map((request) => (

                <div
                  key={request._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    alignItems: "center"
                  }}
                >

                  <div>

                    <div>
                      {request.title}
                    </div>

                    <div>
                      {request.requestId}
                      {" · "}
                      {formatDate(request.createdAt)}
                    </div>

                  </div>


                  {/* Request status */}

                  <span
                    className={
                      request.status === "Completed"
                        ? "badge badge-completed"
                        : request.status === "Pending"
                        ? "badge badge-pending"
                        : "badge badge-assigned"
                    }
                  >
                    {request.status}
                  </span>

                </div>

              ))}

          </div>

        )}

      </div>

    </UserLayout>

  );
}