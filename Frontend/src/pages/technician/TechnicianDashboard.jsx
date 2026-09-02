import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TechnicianLayout from "../../components/layout/TechnicianLayout";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/helpers";
import "../../styles/global.css";

export default function TechnicianDashboard() {

  // Get logged-in technician
  const { user } = useAuth();

  // Used to navigate to another page
  const navigate = useNavigate();


  // Store assigned tasks
  const [tasks, setTasks] = useState([]);

  // Track loading
  const [loading, setLoading] = useState(true);


  // Get assigned tasks when dashboard loads
  useEffect(() => {

    api.get("/requests/assigned")
      .then((response) => {

        setTasks(response.data);

      })
      .finally(() => {

        setLoading(false);

      });

  }, []);


  // Get today's date
  const today = new Date().toDateString();


  // Calculate task counts
  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter((task) => {

    return (
      task.status === "Assigned" ||
      task.status === "Accepted"
    );

  }).length;


  const activeTasks = tasks.filter((task) => {

    return (
      task.status === "In Progress" ||
      task.status === "Waiting for Parts"
    );

  }).length;


  const completedTasks = tasks.filter((task) => {

    return task.status === "Completed";

  }).length;


  const todayTasks = tasks.filter((task) => {

    const updatedDate =
      new Date(task.updatedAt).toDateString();

    return updatedDate === today;

  }).length;


  return (

    <TechnicianLayout
      pageTitle="Dashboard"
      pageSubtitle={`Welcome, ${user?.name}`}
    >

      {/* Summary cards */}

      <div className="grid-4">

        <div className="stat-card">

          <div className="stat-label">
            Total Assigned
          </div>

          <div className="stat-value">
            {totalTasks}
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-label">
            New / Pending
          </div>

          <div className="stat-value">
            {pendingTasks}
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-label">
            Active
          </div>

          <div className="stat-value">
            {activeTasks}
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-label">
            Completed
          </div>

          <div className="stat-value">
            {completedTasks}
          </div>

        </div>

      </div>


      {/* Recent tasks */}

      <div className="card">

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >

          <h3>
            Recent Tasks
          </h3>


          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              navigate("/technician/tasks")
            }
          >
            View All
          </button>

        </div>


        {/* Loading */}

        {loading && (

          <div className="loading-spinner">

            <div className="spinner"></div>

          </div>

        )}


        {/* No tasks */}

        {!loading && tasks.length === 0 && (

          <div className="empty-state">

            <p>
              No tasks assigned yet.
            </p>

          </div>

        )}


        {/* Show recent tasks */}

        {!loading && tasks.length > 0 && (

          <div>

            {tasks
              .slice(0, 5)
              .map((task) => (

                <div
                  key={task._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    alignItems: "center"
                  }}
                >

                  <div>

                    <div>
                      {task.title}
                    </div>

                    <div>
                      {task.requestId}
                      {" · "}
                      {task.user?.name}
                      {" · "}
                      {formatDate(task.createdAt)}
                    </div>

                  </div>


                  {/* Task status */}

                  <span
                    className={
                      task.status === "Completed"
                        ? "badge badge-completed"
                        : task.status === "In Progress"
                        ? "badge badge-progress"
                        : "badge badge-assigned"
                    }
                  >
                    {task.status}
                  </span>

                </div>

              ))}

          </div>

        )}

      </div>

    </TechnicianLayout>

  );
}