import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../api/axios';
import { formatDate } from '../../utils/helpers';
import '../../styles/global.css';
import '../../styles/table.css';

export default function ManageTechnicians() {

  const [technicians, setTechnicians] = useState([]);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editTech, setEditTech] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    phone: '',
    isActive: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get all technicians
  useEffect(() => {
    getTechnicians();
  }, []);

  const getTechnicians = async () => {
    try {
      const response = await api.get('/users');

      const technicians = response.data.filter(
        user => user.role === 'technician'
      );

      setTechnicians(technicians);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Open form for adding technician
  const openCreate = () => {
    setEditTech(null);

    setForm({
      name: '',
      email: '',
      password: '',
      department: '',
      phone: '',
      isActive: true
    });

    setShowModal(true);
  };

  // Open form for editing technician
  const openEdit = (technician) => {
    setEditTech(technician);

    setForm({
      name: technician.name,
      email: technician.email,
      password: '',
      department: technician.department || '',
      phone: technician.phone || '',
      isActive: technician.isActive
    });

    setShowModal(true);
  };

  // Handle Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        ...form,
        role: 'technician'
      };

      // Don't send password when editing
      if (!data.password) {
        delete data.password;
      }

      if (editTech) {

        // Update technician
        const response = await api.put(
          `/users/${editTech._id}`,
          data
        );

        setTechnicians(
          technicians.map(tech =>
            tech._id === response.data._id
              ? response.data
              : tech
          )
        );

      } else {

        // Create technician
        const response = await api.post('/users', data);

        setTechnicians([
          response.data,
          ...technicians
        ]);
      }

      setShowModal(false);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        'Something went wrong'
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete technician
  const handleDelete = async (technician) => {

    const confirmDelete = window.confirm(
      `Delete ${technician.name}?`
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/users/${technician._id}`);

      setTechnicians(
        technicians.filter(
          tech => tech._id !== technician._id
        )
      );

    } catch (error) {
      alert('Delete failed');
    }
  };

  // Change Active / Inactive status
  const toggleStatus = async (technician) => {

    try {
      const response = await api.put(
        `/users/${technician._id}`,
        {
          isActive: !technician.isActive
        }
      );

      setTechnicians(
        technicians.map(tech =>
          tech._id === technician._id
            ? {
                ...tech,
                isActive: response.data.isActive
              }
            : tech
        )
      );

    } catch (error) {
      alert('Failed to update status');
    }
  };

  // Search technicians
  const filteredTechnicians = technicians.filter(tech =>
    tech.name.toLowerCase().includes(search.toLowerCase()) ||
    tech.email.toLowerCase().includes(search.toLowerCase()) ||
    (tech.department || '')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      pageTitle="Technician Management"
      pageSubtitle="Manage service technician accounts"
    >

      {/* Search and Add button */}
      <div className="filter-bar">

        <input
          className="search-input"
          placeholder="Search name, email or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={openCreate}
        >
          + Add Technician
        </button>

      </div>


      {/* Technician Table */}

      {loading ? (

        <div className="loading-spinner">
          Loading...
        </div>

      ) : filteredTechnicians.length === 0 ? (

        <div className="empty-state">
          <h3>No technicians found</h3>
          <p>Add technicians here.</p>
        </div>

      ) : (

        <div className="table-container">

          <table className="data-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredTechnicians.map(tech => (

                <tr key={tech._id}>

                  <td>{tech.name}</td>

                  <td>{tech.email}</td>

                  <td>
                    {tech.department || '-'}
                  </td>

                  <td>
                    {tech.phone || '-'}
                  </td>

                  <td>
                    <button
                      onClick={() => toggleStatus(tech)}
                    >
                      {tech.isActive
                        ? 'Active'
                        : 'Inactive'}
                    </button>
                  </td>

                  <td>
                    {formatDate(tech.createdAt)}
                  </td>

                  <td>

                    <button
                      onClick={() => openEdit(tech)}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(tech)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          <p>
            Showing {filteredTechnicians.length} technician(s)
          </p>

        </div>
      )}


      {/* Add / Edit Form */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>
              {editTech
                ? 'Edit Technician'
                : 'Add New Technician'}
            </h3>

            <form onSubmit={handleSubmit}>

              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value
                  })
                }
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value
                  })
                }
                required={!editTech}
              />

              <select
                value={form.department}
                onChange={(e) =>
                  setForm({
                    ...form,
                    department: e.target.value
                  })
                }
                required
              >
                <option value="">
                  Select Department
                </option>
                <option>IT</option>
                <option>Maintenance</option>
                <option>Electrical</option>
                <option>Plumbing</option>
                <option>Housekeeping</option>
                <option>Security</option>
                <option>General</option>
              </select>

              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value
                  })
                }
              />

              <select
                value={form.isActive}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isActive: e.target.value === 'true'
                  })
                }
              >
                <option value="true">
                  Active
                </option>

                <option value="false">
                  Inactive
                </option>
              </select>

              <button
                type="button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : editTech
                  ? 'Update Technician'
                  : 'Create Technician'}
              </button>

            </form>

          </div>

        </div>

      )}

    </AdminLayout>
  );
}