import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../api/axios";

export default function ManageCategories() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const [form, setForm] = useState({
    name: "",
    department: "",
    description: ""
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  // Get all categories
  useEffect(() => {

    api.get("/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);


  // Open modal for creating
  const openCreate = () => {

    setEditCategory(null);

    setForm({
      name: "",
      department: "",
      description: ""
    });

    setError("");
    setShowModal(true);
  };


  // Open modal for editing
  const openEdit = (category) => {

    setEditCategory(category);

    setForm({
      name: category.name,
      department: category.department,
      description: category.description || ""
    });

    setError("");
    setShowModal(true);
  };


  // Create or update category
  const handleSubmit = async (event) => {

    event.preventDefault();
    setSaving(true);

    try {

      if (editCategory) {

        // Update existing category
        const response = await api.put(
          `/categories/${editCategory._id}`,
          form
        );

        setCategories((oldCategories) =>
          oldCategories.map((category) =>
            category._id === response.data._id
              ? response.data
              : category
          )
        );

      } else {

        // Create new category
        const response = await api.post(
          "/categories",
          form
        );

        setCategories((oldCategories) => [
          response.data,
          ...oldCategories
        ]);
      }

      setShowModal(false);

    } catch (error) {

      setError(
        error.response?.data?.message || "Save failed"
      );

    } finally {

      setSaving(false);

    }
  };


  // Delete category
  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Delete this category?"
    );

    if (!confirmed) {
      return;
    }

    await api.delete(`/categories/${id}`);

    setCategories((oldCategories) =>
      oldCategories.filter(
        (category) => category._id !== id
      )
    );
  };


  return (
    <AdminLayout
      pageTitle="Categories"
      pageSubtitle="Manage service categories and departments"
    >

      <button onClick={openCreate}>
        + Add Category
      </button>


      {/* Category table */}

      {loading ? (

        <div>Loading...</div>

      ) : (

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {categories.map((category) => (

              <tr key={category._id}>

                <td>{category.name}</td>

                <td>{category.department}</td>

                <td>
                  {category.description || "-"}
                </td>

                <td>
                  {category.isActive
                    ? "Active"
                    : "Inactive"}
                </td>

                <td>

                  <button
                    onClick={() => openEdit(category)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(category._id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>
      )}


      {/* Create/Edit modal */}

      {showModal && (

        <div className="modal">

          <h3>
            {editCategory
              ? "Edit Category"
              : "New Category"}
          </h3>

          {error && <p>{error}</p>}

          <form onSubmit={handleSubmit}>

            <input
              placeholder="Category name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
            />

            <input
              placeholder="Department"
              value={form.department}
              onChange={(e) =>
                setForm({
                  ...form,
                  department: e.target.value
                })
              }
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value
                })
              }
            />

            <button
              type="button"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>

          </form>

        </div>
      )}

    </AdminLayout>
  );
}