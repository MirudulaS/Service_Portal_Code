import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../components/layout/UserLayout";
import api from "../../api/axios";
import "../../styles/global.css";

export default function SubmitRequest() {

  const navigate = useNavigate();

  // Store available categories
  const [categories, setCategories] = useState([]);

  // Store form values
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    priority: "Medium",
    location: ""
  });

  // Store selected image
  const [image, setImage] = useState(null);

  // Track form submission
  const [loading, setLoading] = useState(false);

  // Store error message
  const [error, setError] = useState("");

  // Store success message
  const [success, setSuccess] = useState("");


  // Get active categories when page loads
  useEffect(() => {

    api.get("/categories")
      .then((response) => {

        const activeCategories =
          response.data.filter((category) => {
            return category.isActive;
          });

        setCategories(activeCategories);

      });

  }, []);


  // Handle form input changes
  const handleChange = (event) => {

    const name = event.target.name;
    const value = event.target.value;

    setFormData({
      ...formData,
      [name]: value
    });

  };


  // Submit service request
  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      // Create FormData because
      // we are sending text fields and an image
      const formDataToSend = new FormData();


      // Add all form fields
      formDataToSend.append(
        "category",
        formData.category
      );

      formDataToSend.append(
        "title",
        formData.title
      );

      formDataToSend.append(
        "description",
        formData.description
      );

      formDataToSend.append(
        "priority",
        formData.priority
      );

      formDataToSend.append(
        "location",
        formData.location
      );


      // Add image if the user selected one
      if (image) {

        formDataToSend.append(
          "image",
          image
        );

      }


      // Send request to backend
      await api.post(
        "/requests",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );


      // Show success message
      setSuccess(
        "Request submitted successfully!"
      );


      // Go to My Requests page
      setTimeout(() => {

        navigate("/user/my-requests");

      }, 1500);


    } catch (error) {

      const errorMessage =
        error.response?.data?.message ||
        "Failed to submit request";

      setError(errorMessage);


    } finally {

      setLoading(false);

    }

  };


  return (

    <UserLayout
      pageTitle="Submit Request"
      pageSubtitle="Report a new service issue"
    >

      <div style={{ maxWidth: "620px" }}>

        <div className="card">

          <h2>
            New Service Request
          </h2>

          <p>
            Fill in the details of your issue below.
          </p>


          {/* Error message */}

          {error && (

            <div className="alert alert-error">
              {error}
            </div>

          )}


          {/* Success message */}

          {success && (

            <div className="alert alert-success">
              {success}
            </div>

          )}


          <form onSubmit={handleSubmit}>


            {/* Category */}

            <div className="form-group">

              <label className="form-label">
                Category *
              </label>

              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select a category
                </option>

                {categories.map((category) => (

                  <option
                    key={category._id}
                    value={category._id}
                  >

                    {category.name}
                    {" — "}
                    {category.department}

                  </option>

                ))}

              </select>

            </div>


            {/* Title */}

            <div className="form-group">

              <label className="form-label">
                Request Title *
              </label>

              <input
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Brief description of the issue"
              />

            </div>


            {/* Description */}

            <div className="form-group">

              <label className="form-label">
                Detailed Description *
              </label>

              <textarea
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe the issue in detail..."
              />

            </div>


            {/* Priority */}

            <div className="form-group">

              <label className="form-label">
                Priority
              </label>

              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

                <option value="Urgent">
                  Urgent
                </option>

              </select>

            </div>


            {/* Location */}

            <div className="form-group">

              <label className="form-label">
                Location
              </label>

              <input
                type="text"
                name="location"
                className="form-input"
                value={formData.location}
                onChange={handleChange}
                placeholder="Room no / Block / Area"
              />

            </div>


            {/* Image */}

            <div className="form-group">

              <label className="form-label">
                Attach Image (optional)
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(event) => {

                  setImage(
                    event.target.files[0]
                  );

                }}
              />

              <p>
                Max 5MB. JPEG, PNG, GIF
              </p>

            </div>


            {/* Buttons */}

            <div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >

                {loading
                  ? "Submitting..."
                  : "Submit Request"}

              </button>


              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  navigate("/user/dashboard")
                }
              >

                Cancel

              </button>

            </div>

          </form>

        </div>

      </div>

    </UserLayout>

  );
}