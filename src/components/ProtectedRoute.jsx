import React from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";

export const ProtectedRoute = ({ children }) => {
    const { token, loading } = useContext(AuthContext);

    if (loading) {
        return null;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
