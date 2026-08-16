import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // Get logged-in user from localStorage
  const storedUser = localStorage.getItem("userInfo");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  const [user, setUser] = useState(initialUser);

  // Login
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password
    });

    const userData = response.data;

    localStorage.setItem(
      "userInfo",
      JSON.stringify(userData)
    );

    setUser(userData);

    return userData;
  };

  // Register
  const register = async (formData) => {
    const response = await api.post("/auth/register", formData);

    const userData = response.data;

    localStorage.setItem(
      "userInfo",
      JSON.stringify(userData)
    );

    setUser(userData);

    return userData;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  // Update user information
  const updateUser = (updatedData) => {
    const newUser = {
      ...user,
      ...updatedData
    };

    localStorage.setItem(
      "userInfo",
      JSON.stringify(newUser)
    );

    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};