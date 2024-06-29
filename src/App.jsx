import React from "react";
import FrontPage from "./components/FrontPage";
import LoginPage from "./components/LoginPage";
import Settings from "./components/Settings";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./utils/AuthContext";

import Dashboard from "./components/Dashboard";

import { Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";

export const socket = io(`http://localhost:${import.meta.env.VITE_PORT}`);

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<FrontPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/dashboard/:userId"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/:userId/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;
