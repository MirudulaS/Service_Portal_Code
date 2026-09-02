import { useEffect, useState } from "react";
import UserLayout from "../../components/layout/UserLayout";
import api from "../../api/axios";
import {
  formatDate,
  getStatusColor,
  getPriorityColor,
  truncateText
} from "../../utils/helpers";
import "../../styles/global.css";
import "../../styles/table.css";

export default function MyRequests() {

  // Store all requests created by the user
  const [requests, setRequests] = useState([]);

  // Store requests after applying search and filter
  const [filteredRequests, setFilteredRequests] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Search text
  const [search, setSearch] = useState("");

  // Selected status filter
  const [statusFilter, setStatusFilter] = useState("");


  // Get user's requests when page loads
  useEffect(() => {

    api.get("/requests/my")
      .then((response) => {
        setRequests(response.data);
        setFilteredRequests(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  // Apply search and status filter
  useEffect(() => {

    let result = requests;


    // Search by request ID or title
    if (search) {

      result = result.filter((request) => {

        const requestId =
          request.requestId?.toLowerCase() || "";

        const title =
          request.title?.toLowerCase() || "";

        const searchText =
          search.toLowerCase();

        return (
          requestId.includes(searchText) ||
          title.includes(searchText)
        );

      });

    }


    // Filter by status
    if (statusFilter) {

      result = result.filter((request) => {

        return request.status === statusFilter;

      });

    }


    // Store filtered results
    setFilteredRequests(result);

  }, [search, statusFilter, requests]);


  // Cancel a request
  const handleCancel = async (id) => {

    const confirmed = window.confirm(
      "Cancel this request?"
    );

    if (!confirmed) {
      return;
    }


    try {

      // Tell backend to cancel the request
      await api.put(`/requests/${id}/cancel`);


      // Update the request in frontend
      setRequests((oldRequests) => {

        return oldRequests.map((request) => {

          if (request._id === id) {

            return {
              ...request,
              status: "Cancelled"
            };

          }

          return request;

        });

      });

    } catch (error) {

      const message =
        error.response?.data?.message ||
        "Cannot cancel request";

      alert(message);

    }

  };


  // Get CSS class based on request status
  const getBadgeClass = (status) => {

    const statusClasses = {

      Pending: "badge-pending",

      Assigned: "badge-assigned",

      "In Progress": "badge-progress",

      "Waiting for Parts": "badge-waiting",

      Completed: "badge-completed",

      Rejected: "badge-rejected",

      Cancelled: "badge-cancelled"

    };

    return statusClasses[status] || "";

  };


  return (

    <UserLayout
      pageTitle="My Requests"
      pageSubtitle="Track all your service requests"
    >

      {/* Search and filter */}

      <div className="filter-bar">

        <input
          className="search-input"
          placeholder="Search by ID or title..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />


        <select
          className="form-select"
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
          }}
        >

          <option value="">
            All Statuses
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Assigned">
            Assigned
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Waiting for Parts">
            Waiting for Parts
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Rejected">
            Rejected
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>

      </div>


      {/* Loading */}

      {loading && (

        <div className="loading-spinner">

          <div className="spinner"></div>

        </div>

      )}


      {/* No requests */}

      {!loading && filteredRequests.length === 0 && (

        <div className="empty-state">

          <h3>
            No requests found
          </h3>

          <p>
            Submit a new request when you have
            an issue to report.
          </p>

        </div>

      )}


      {/* Request table */}

      {!loading && filteredRequests.length > 0 && (

        <div className="table-container">

          <table className="data-table">

            <thead>

              <tr>

                <th>Request ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Technician</th>
                <th>Date</th>
                <th>Action</th>

              </tr>

            </thead>


            <tbody>

              {filteredRequests.map((request) => (

                <tr key={request._id}>

                  {/* Request ID */}

                  <td>

                    <code>
                      {request.requestId}
                    </code>

                  </td>


                  {/* Title */}

                  <td>

                    {truncateText(
                      request.title,
                      35
                    )}

                  </td>


                  {/* Category */}

                  <td>

                    {request.category?.name}

                  </td>


                  {/* Priority */}

                  <td>

                    <span
                      className={
                        `badge badge-${
                          request.priority?.toLowerCase()
                        }`
                      }
                    >
                      {request.priority}
                    </span>

                  </td>


                  {/* Status */}

                  <td>

                    <span
                      className={
                        `badge ${getBadgeClass(
                          request.status
                        )}`
                      }
                    >
                      {request.status}
                    </span>

                  </td>


                  {/* Technician */}

                  <td>

                    {request.assignedTechnician?.name || "—"}

                  </td>


                  {/* Date */}

                  <td>

                    {formatDate(
                      request.createdAt
                    )}

                  </td>


                  {/* Cancel button */}

                  <td>

                    {request.status === "Pending" && (

                      <button
                        className="action-btn delete"
                        onClick={() =>
                          handleCancel(request._id)
                        }
                      >
                        Cancel
                      </button>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </UserLayout>

  );
}