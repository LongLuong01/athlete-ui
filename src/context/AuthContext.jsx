// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded) {
          setUser({ id: decoded.id, role: decoded.role });
          // navigate('/review')
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
        logout();
      }
    }
  }, []);

  const login = (token, from) => {
    const decoded = jwtDecode(token.token);
    if (decoded) {
      localStorage.setItem("token", token.token);
      setUser({ id: decoded.id, role: decoded.role });
      // navigate("/review");
      navigate(from, { replace: true });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
