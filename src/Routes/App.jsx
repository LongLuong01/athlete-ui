import React from "react";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, AuthContext } from "../context/AuthContext";
import Login from "../pages/Login";
import WellBeingReview from "../components/WellBeingReview";
import Dashboard from "../pages/Dashboard";
import UserInformation from "../pages/UserInformation";
import Sidebar from "../components/Sidebar";

// Component bảo vệ trang admin
const PrivateRoute = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div>
      <div className="flex overflow-y-hidden bg-white font-inter">
        <Sidebar />
      </div>
      <div className="body h-full overflow-hidden lg:ml-auto max-lg:w-full relative lg:w-[calc(100%-256px)] border-l border-solid border-gray-200">
        {children}
      </div>{" "}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/review"
          element={
            <PrivateRoute>
              <WellBeingReview />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-info"
          element={
            <PrivateRoute>
              <UserInformation />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
