import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      return <Navigate to="/" replace />;
    }

    if (role && user.role !== role) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (err) {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
