import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../api/axios";

export default function ManageRequests() {

  const [requests, setRequests] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const [filteredRequests, setFilteredRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState(null);

  const [adminData, setAdminData] = useState({
    status: "",
    assignedTechnician: "",
    adminNotes: "",
    priority: ""
  });

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");


  // Get requests and technicians
  useEffect(() => {

    Promise.all([
      api.get("/requests"),
      api.get("/users/technicians")
    ])
      .then(([requestResponse, technicianResponse]) => {

        setRequests(requestResponse.data);

        setFilteredRequests(requestResponse.data);

        setTechnicians(technicianResponse.data);

      })
      .finally(() => {
        setLoading(false);
      });

  }, []);


  // Search and filter requests
  useEffect(() => {

    let result = requests;

    if (search) {

      result = result.filter((request) =>
        request.requestId?.includes(search) ||
        request.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        request.user?.name
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    }

    if (statusFilter) {

      result = result.filter(
        (request) => request.status === statusFilter
      );

    }

    setFilteredRequests(result);

  }, [search, statusFilter, requests]);


  // Open request details
  const openModal = (request) => {

    setSelectedRequest(request);

    setAdminData({
      status: request.status,
      assignedTechnician:
        request.assignedTechnician?._id || "",
      adminNotes: request.adminNotes || "",
      priority: request.priority
    });

  };


  // Update request
  const handleUpdate = async (event) => {

    event.preventDefault();
    setSaving(true);

    try {

      const response = await api.put(
        `/requests/${selectedRequest._id}/admin`,
        adminData
      );

      setRequests((oldRequests) =>
        oldRequests.map((request) =>
          request._id === response.data._id
            ? response.data
            : request
        )
      );

      setSelectedRequest(null);

    } catch (error) {

      alert("Update failed");

    } finally {

      setSaving(false);

    }
  };


  return (
    <AdminLayout
      pageTitle="Service Requests"
      pageSubtitle="Review and manage all requests"
    >

      {/* Search */}
      <input
        placeholder="Search ID, title, user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />


      {/* Status filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Assigned">Assigned</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Rejected">Rejected</option>
      </select>


      {/* Requests table */}

      {loading ? (

        <div>Loading...</div>

      ) : (

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>User</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Technician</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredRequests.map((request) => (

              <tr key={request._id}>

                <td>{request.requestId}</td>

                <td>{request.title}</td>

                <td>{request.user?.name}</td>

                <td>{request.status}</td>

                <td>{request.priority}</td>

                <td>
                  {request.assignedTechnician?.name || "Unassigned"}
                </td>

                <td>
                  <button
                    onClick={() => openModal(request)}
                  >
                    Manage
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}


      {/* Manage modal */}

      {selectedRequest && (

        <div className="modal">

          <h3>
            Manage Request
          </h3>

          <form onSubmit={handleUpdate}>

            {/* Status */}
            <select
              value={adminData.status}
              onChange={(e) =>
                setAdminData({
                  ...adminData,
                  status: e.target.value
                })
              }
            >
              <option>Pending</option>
              <option>Assigned</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Rejected</option>
            </select>


            {/* Priority */}
            <select
              value={adminData.priority}
              onChange={(e) =>
                setAdminData({
                  ...adminData,
                  priority: e.target.value
                })
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>


            {/* Technician */}
            <select
              value={adminData.assignedTechnician}
              onChange={(e) =>
                setAdminData({
                  ...adminData,
                  assignedTechnician: e.target.value
                })
              }
            >
              <option value="">Unassigned</option>

              {technicians.map((technician) => (
                <option
                  key={technician._id}
                  value={technician._id}
                >
                  {technician.name}
                </option>
              ))}

            </select>


            {/* Notes */}
            <textarea
              value={adminData.adminNotes}
              onChange={(e) =>
                setAdminData({
                  ...adminData,
                  adminNotes: e.target.value
                })
              }
            />


            <button
              type="button"
              onClick={() => setSelectedRequest(null)}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </form>

        </div>

      )}

    </AdminLayout>
  );
}