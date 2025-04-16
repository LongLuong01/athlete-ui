// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getStoredToken();
      const storedUserInfo = getStoredUserInfo();
      
      if (token && isTokenValid(token)) {
        try {
          // Optional: Validate token with server
          // const isValid = await authApi.validateToken(token);
          // if (!isValid) throw new Error('Invalid token');
          
          const decoded = decodeToken(token);
          if (decoded) {
            setUser({ id: decoded.id, role: decoded.role });
            if (storedUserInfo) {
              setUserInfo(storedUserInfo);
            }
            
            // Only redirect to /review if we're on the login page
            if (location.pathname === '/login') {
              navigate('/review', { replace: true });
            }
          } else {
            throw new Error('Invalid token format');
          }
        } catch (error) {
          console.error("Token validation error:", error);
          handleLogout();
        }
      } else if (token) {
        // Token exists but is invalid or expired
        handleLogout();
      }
      setLoading(false);
    };

    initializeAuth();
  }, [navigate, location.pathname]);

  const handleLogin = async (response) => {
    try {
      const { token, user: userInfo, message } = response;
      const decoded = decodeToken(token);
      
      if (!decoded) {
        throw new Error('Invalid token format');
      }

      // Store auth data
      storeAuthData(token, userInfo);
      
      // Update state
      setUser({ id: decoded.id, role: decoded.role });
      setUserInfo(userInfo);

      // Get redirect path from location state or default to /review
      const from = location.state?.from || '/review';
      navigate(from, { replace: true });

      return message;
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
