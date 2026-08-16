import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Add token to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

// Handle unauthorized requests
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";

      // Don't redirect for login/register APIs
      if (!url.includes("/auth/")) {
        localStorage.removeItem("userInfo");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;