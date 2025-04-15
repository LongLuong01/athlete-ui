import React from "react";
import { useContext } from "react";
import { Navigate, useLocation  } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, AuthContext } from "../context/AuthContext";
import Login from "../pages/Login";
import WellBeingReview from "../components/WellBeingReview";
import Sidebar from "../components/Sidebar";

// Component bảo vệ trang admin
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  return user ? (
    <div>
      <div className="flex overflow-y-hidden bg-white font-inter">
        <Sidebar />
      </div>
      <div className="body h-full overflow-hidden lg:ml-auto max-lg:w-full relative lg:w-[calc(100%-256px)] border-l border-solid border-gray-200">
        {children}
      </div>{" "}
    </div>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/review"
          element={
            <PrivateRoute>
              <WellBeingReview />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
