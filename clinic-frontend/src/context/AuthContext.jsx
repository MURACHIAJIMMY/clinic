
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContextValue";
import api from "@/lib/axios"; // 🔄 Ensure this path matches your project structure

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();

  const login = async ({ token, user }) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // 🩺 Fetch and merge patient profile data if user is a patient
    if (user?.role === "patient") {
      try {
        const res = await api.get("/patients/me");
        const fullUser = { ...user, ...res.data };
        setUser(fullUser);
        localStorage.setItem("user", JSON.stringify(fullUser));
        user = fullUser; // Update variable for correct redirect below
      } catch (err) {
        console.error("Failed to fetch patient profile:", err.message);
      }
    }

    // 🎯 Redirect based on role
    if (user?.role === "doctor") {
      navigate("/dashboard");
    } else if (user?.role === "patient") {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
