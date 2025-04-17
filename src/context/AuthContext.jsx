// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import {
  getStoredToken,
  getStoredUserInfo,
  storeAuthData,
  clearAuthData,
  isTokenValid,
  decodeToken
} from "../utils/auth";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getStoredToken();
      const storedUserInfo = getStoredUserInfo();
      
      if (token && isTokenValid(token)) {
        try {
          const decoded = decodeToken(token);
          if (decoded) {
            setUser({ id: decoded.id, role: decoded.role });
            if (storedUserInfo) {
              setUserInfo(storedUserInfo);
            }
          } else {
            throw new Error('Invalid token format');
          }
        } catch (error) {
          console.error("Token validation error:", error);
          handleLogout();
        }
      } else if (token) {
        handleLogout();
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = async (response, from = '/review') => {
    try {
      const { token, user: userInfo } = response;
      const decoded = decodeToken(token);
      
      if (!decoded) {
        throw new Error('Invalid token format');
      }

      storeAuthData(token, userInfo);
      setUser({ id: decoded.id, role: decoded.role });
      setUserInfo(userInfo);

      // Navigate to the redirect path
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Invalid login response");
    }
  };

  const handleLogout = () => {
    clearAuthData();
    setUser(null);
    setUserInfo(null);
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        userInfo,
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated: !!user,
        isLoading: loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
