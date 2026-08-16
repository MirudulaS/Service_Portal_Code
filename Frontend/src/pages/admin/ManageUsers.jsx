import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../api/axios';
import { formatDate } from '../../utils/helpers';

import '../../styles/global.css';
import '../../styles/table.css';

export default function ManageUsers() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    hostel: '',
    phone: '',
    isActive: true
  });


  // Get all users
  useEffect(() => {
    getUsers();
  }, []);


  const getUsers = async () => {

    try {

      const response = await api.get('/users');

      // Get only normal users
      const userList = response.data.filter(
        user => user.role === 'user'
      );

      setUsers(userList);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };


  // Open form for adding user
  const openCreate = () => {

    setEditUser(null);

    setForm({
      name: '',
      email: '',
      password: '',
      department: '',
      hostel: '',
      phone: '',
      isActive: true
    });

    setShowModal(true);
  };


  // Open form for editing user
  const openEdit = (user) => {

    setEditUser(user);

    setForm({
      name: user.name,
      email: user.email,
      password: '',
      department: user.department || '',
      hostel: user.hostel || '',
      phone: user.phone || '',
      isActive: user.isActive
    });

    setShowModal(true);
  };


  // Add or update user
  const handleSubmit = async (e) => {

    e.preventDefault();
    setSaving(true);

    try {

      const userData = {
        ...form,
        role: 'user'
      };

      // Password is optional while editing
      if (!userData.password) {
        delete userData.password;
      }


      if (editUser) {

        // Update existing user
        const response = await api.put(
          `/users/${editUser._id}`,
          userData
        );

        setUsers(
          users.map(user =>
            user._id === response.data._id
              ? response.data
              : user
          )
        );

      } else {

        // Create new user
        const response = await api.post(
          '/users',
          userData
        );

        setUsers([
          response.data,
          ...users
        ]);
      }

      setShowModal(false);

    } catch (error) {

      alert(
        error.response?.data?.message ||
        'Save failed'
      );

    } finally {

      setSaving(false);

    }
  };


  // Delete user
  const handleDelete = async (user) => {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(`/users/${user._id}`);

      setUsers(
        users.filter(
          item => item._id !== user._id
        )
      );

    } catch (error) {

      alert('Delete failed');

    }
  };


  // Change active/inactive status
  const toggleStatus = async (user) => {

    try {

      const response = await api.put(
        `/users/${user._id}`,
        {
          isActive: !user.isActive
        }
      );

      setUsers(
        users.map(item =>
          item._id === user._id
            ? {
                ...item,
                isActive: response.data.isActive
              }
            : item
        )
      );

    } catch (error) {

      alert('Failed to update status');

    }
  };


  // Search users
  const filteredUsers = users.filter(user =>

    user.name
      .toLowerCase()
      .includes(search.toLowerCase())

    ||

    user.email
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  return (

    <AdminLayout
      pageTitle="User Management"
      pageSubtitle="Manage student and staff accounts"
    >

      {/* Search and Add button */}

      <div className="filter-bar">

        <input
          className="search-input"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={openCreate}
        >
          + Add User
        </button>

      </div>


      {/* User list */}

      {loading ? (

        <div className="loading-spinner">
          Loading...
        </div>

      ) : filteredUsers.length === 0 ? (

        <div className="empty-state">
          <h3>No users found</h3>
          <p>Users will appear here.</p>
        </div>

      ) : (

        <div className="table-container">

          <table className="data-table">

            <thead>

              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Hostel</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>

            </thead>


            <tbody>

              {filteredUsers.map(user => (

                <tr key={user._id}>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>
                    {user.department || '-'}
                  </td>

                  <td>
                    {user.hostel || '-'}
                  </td>

                  <td>
                    {user.phone || '-'}
                  </td>

                  <td>

                    <button
                      onClick={() => toggleStatus(user)}
                    >
                      {user.isActive
                        ? 'Active'
                        : 'Inactive'}
                    </button>

                  </td>

                  <td>
                    {formatDate(user.createdAt)}
                  </td>

                  <td>

                    <button
                      onClick={() => openEdit(user)}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>


          <p>
            Showing {filteredUsers.length} user(s)
          </p>

        </div>

      )}


      {/* Add / Edit modal */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>
              {editUser
                ? 'Edit User'
                : 'Create New User'}
            </h3>


            <form onSubmit={handleSubmit}>

              <input
                placeholder="Full Name"
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
                required={!editUser}
              />


              <select
                value={form.department}
                onChange={(e) =>
                  setForm({
                    ...form,
                    department: e.target.value
                  })
                }
              >

                <option value="">
                  Select Department
                </option>

                <option>Computer Science</option>
                <option>Electronics</option>
                <option>Mechanical</option>
                <option>Civil</option>
                <option>Arts & Science</option>
                <option>Management</option>
                <option>Staff</option>

              </select>


              <input
                placeholder="Hostel / Block"
                value={form.hostel}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hostel: e.target.value
                  })
                }
              />


              <input
                placeholder="Phone Number"
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
                  : editUser
                  ? 'Update User'
                  : 'Create User'}

              </button>

            </form>

          </div>

        </div>

      )}

    </AdminLayout>
  );
}