import { useEffect, useState } from "react";
import TechnicianLayout from "../../components/layout/TechnicianLayout";
import api from "../../api/axios";
import { formatDate, truncateText } from "../../utils/helpers";
import "../../styles/global.css";
import "../../styles/dashboard.css";

const STATUSES = [
  "Accepted",
  "In Progress",
  "Waiting for Parts",
  "Completed"
];

export default function AssignedTasks() {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTask, setSelectedTask] = useState(null);

  const [updateData, setUpdateData] = useState({
    status: "",
    technicianNotes: ""
  });

  const [repairImage, setRepairImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");


  // Get assigned tasks
  const fetchTasks = () => {

    setLoading(true);

    api.get("/requests/assigned")
      .then((response) => {
        setTasks(response.data);
      })
      .catch(() => {
        setTasks([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  // Run when page loads
  useEffect(() => {
    fetchTasks();
  }, []);


  // Open task
  const openTask = (task) => {

    setSelectedTask(task);

    setUpdateData({
      status: task.status,
      technicianNotes: task.technicianNotes || ""
    });

    setRepairImage(null);
    setMessage("");
  };


  // Close modal
  const closeModal = () => {

    setSelectedTask(null);
    setMessage("");
    setRepairImage(null);
  };


  // Update task
  const handleUpdate = async (event) => {

    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {

      const formData = new FormData();

      formData.append("status", updateData.status);

      formData.append(
        "technicianNotes",
        updateData.technicianNotes
      );

      if (repairImage) {
        formData.append("repairImage", repairImage);
      }


      const response = await api.put(
        `/requests/${selectedTask._id}/technician`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      const updatedTask = response.data;


      // Replace old task with updated task
      setTasks((oldTasks) => {

        return oldTasks.map((task) => {

          if (task._id === updatedTask._id) {
            return updatedTask;
          }

          return task;

        });

      });


      setMessage("Task updated successfully!");


      // Close modal after 1.2 seconds
      setTimeout(() => {
        closeModal();
      }, 1200);


    } catch (error) {

      const errorMessage =
        error.response?.data?.message ||
        "Update failed. Please try again.";

      setMessage(errorMessage);


    } finally {

      setSaving(false);

    }
  };


  // Get CSS class based on status
  const getBadgeClass = (status) => {

    const statusClasses = {

      Pending: "badge-pending",
      Assigned: "badge-assigned",
      Accepted: "badge-assigned",
      "In Progress": "badge-progress",
      "Waiting for Parts": "badge-waiting",
      Completed: "badge-completed",
      Rejected: "badge-rejected",
      Cancelled: "badge-cancelled"

    };

    return statusClasses[status] || "";
  };


  return (

    <TechnicianLayout
      pageTitle="Assigned Tasks"
      pageSubtitle="Manage and update your work orders"
    >

      {/* Loading */}
      {loading && (

        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>

      )}


      {/* No tasks */}
      {!loading && tasks.length === 0 && (

        <div className="empty-state">

          <h3>No tasks assigned yet</h3>

          <p>
            Check back later for new assignments.
          </p>

        </div>

      )}


      {/* Task list */}
      {!loading && tasks.length > 0 && (

        <div>

          {tasks.map((task) => (

            <div
              key={task._id}
              className="task-card"
            >

              <div className="task-card-header">

                <div>

                  <code>
                    {task.requestId}
                  </code>

                  <h4>
                    {task.title}
                  </h4>

                </div>

                <span
                  className={`badge ${getBadgeClass(task.status)}`}
                >
                  {task.status}
                </span>

              </div>


              <p className="task-description">

                {truncateText(
                  task.description,
                  100
                )}

              </p>


              <div className="task-card-meta">

                <span>
                  Reported by:
                  <strong>
                    {task.user?.name || "—"}
                  </strong>
                </span>

                <span>
                  Dept:
                  {task.user?.department || "—"}
                </span>

                <span>
                  Location:
                  {task.location || "—"}
                </span>

                <span>
                  Date:
                  {formatDate(task.createdAt)}
                </span>

              </div>


              {task.technicianNotes && (

                <div className="technician-notes">

                  <strong>Notes:</strong>

                  {task.technicianNotes}

                </div>

              )}


              <div className="task-actions">

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => openTask(task)}
                  disabled={task.status === "Completed"}
                >

                  {task.status === "Completed"
                    ? "✓ Completed"
                    : "Update Status"}

                </button>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* Update modal */}

      {selectedTask && (

        <div
          className="modal-overlay"
          onClick={closeModal}
        >

          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <h3>
                Update Task
              </h3>

              <button
                className="modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>


            <p>
              <strong>
                {selectedTask.title}
              </strong>
            </p>

            <p>
              Reported by:
              {selectedTask.user?.name}
              {" · "}
              {selectedTask.user?.department}
            </p>


            {message && (

              <div
                className={
                  message.includes("success")
                    ? "alert alert-success"
                    : "alert alert-error"
                }
              >
                {message}
              </div>

            )}


            <form onSubmit={handleUpdate}>

              {/* Status */}

              <div className="form-group">

                <label>
                  Update Status
                </label>

                <select
                  value={updateData.status}
                  onChange={(event) => {

                    setUpdateData({
                      ...updateData,
                      status: event.target.value
                    });

                  }}
                >

                  {STATUSES.map((status) => (

                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>

                  ))}

                </select>

              </div>


              {/* Work notes */}

              <div className="form-group">

                <label>
                  Work Notes
                </label>

                <textarea
                  value={updateData.technicianNotes}
                  onChange={(event) => {

                    setUpdateData({
                      ...updateData,
                      technicianNotes: event.target.value
                    });

                  }}
                  placeholder="Describe what was done..."
                />

              </div>


              {/* Repair image */}

              <div className="form-group">

                <label>
                  Upload Repair Photo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {

                    setRepairImage(
                      event.target.files[0]
                    );

                  }}
                />

              </div>


              <div className="modal-footer">

                <button
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                >

                  {saving
                    ? "Saving..."
                    : "Save Update"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </TechnicianLayout>

  );
}