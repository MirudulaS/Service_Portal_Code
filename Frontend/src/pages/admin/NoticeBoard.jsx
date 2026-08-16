import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../api/axios';
import { formatDateTime } from '../../utils/helpers';

import '../../styles/global.css';
import '../../styles/dashboard.css';

export default function NoticeBoard() {

  const [notices, setNotices] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    content: '',
    priority: 'Normal'
  });

  const [saving, setSaving] = useState(false);


  // Get all notices
  useEffect(() => {
    getNotices();
  }, []);


  const getNotices = async () => {

    try {

      const response = await api.get('/notices');

      setNotices(response.data);

    } catch (error) {

      console.log(error);

    }
  };


  // Add new notice
  const handleSubmit = async (e) => {

    e.preventDefault();
    setSaving(true);

    try {

      const response = await api.post(
        '/notices',
        form
      );

      // Add new notice at the beginning
      setNotices([
        response.data,
        ...notices
      ]);

      // Close modal
      setShowModal(false);

      // Clear form
      setForm({
        title: '',
        content: '',
        priority: 'Normal'
      });

    } catch (error) {

      alert(
        error.response?.data?.message ||
        'Failed to post notice'
      );

    } finally {

      setSaving(false);

    }
  };


  // Delete notice
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      'Delete this notice?'
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(`/notices/${id}`);

      // Remove deleted notice from state
      setNotices(
        notices.filter(
          notice => notice._id !== id
        )
      );

    } catch (error) {

      alert('Failed to delete notice');

    }
  };


  return (

    <AdminLayout
      pageTitle="Notice Board"
      pageSubtitle="Post and manage announcements"
    >

      {/* Add Notice button */}

      <div className="filter-bar">

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Post Notice
        </button>

      </div>


      {/* Display notices */}

      {notices.length === 0 ? (

        <div className="empty-state">

          <h3>No notices posted</h3>

          <p>
            Post a notice to inform students and staff.
          </p>

        </div>

      ) : (

        notices.map(notice => (

          <div
            key={notice._id}
            className={`notice-card ${notice.priority.toLowerCase()}`}
          >

            <div className="notice-header">

              <div className="notice-title">
                {notice.title}
              </div>

              <div>

                <span className="badge">
                  {notice.priority}
                </span>

                <button
                  className="action-btn delete"
                  onClick={() =>
                    handleDelete(notice._id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>


            <div className="notice-body">
              {notice.content}
            </div>


            <div className="notice-meta">

              Posted by {notice.postedBy?.name}
              {' · '}
              {formatDateTime(notice.createdAt)}

            </div>

          </div>

        ))

      )}


      {/* Add Notice Modal */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h3>Post New Notice</h3>

              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>

            </div>


            <form onSubmit={handleSubmit}>

              {/* Title */}

              <div className="form-group">

                <label className="form-label">
                  Title
                </label>

                <input
                  className="form-input"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value
                    })
                  }
                  required
                />

              </div>


              {/* Content */}

              <div className="form-group">

                <label className="form-label">
                  Content
                </label>

                <textarea
                  className="form-textarea"
                  value={form.content}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      content: e.target.value
                    })
                  }
                  required
                />

              </div>


              {/* Priority */}

              <div className="form-group">

                <label className="form-label">
                  Priority
                </label>

                <select
                  className="form-select"
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value
                    })
                  }
                >

                  <option>Normal</option>
                  <option>Important</option>
                  <option>Urgent</option>

                </select>

              </div>


              {/* Buttons */}

              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? 'Posting...'
                    : 'Post Notice'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </AdminLayout>
  );
}