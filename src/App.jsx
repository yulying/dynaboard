import React, { Component } from "react";
import { AuthProvider } from "./utils/AuthContext";
import EventBus from "./utils/EventBus";

import FrontPage from "./components/FrontPage";
import LoginPage from "./components/LoginPage";
import Settings from "./components/Settings";
import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound";

import { Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";

export const socket = io(`https://localhost:${import.meta.env.VITE_PORT}`);

class App extends Component {
    componentDidMount() {
        EventBus.on("logout", () => {
            authService.logout();
        });
    }

    componentWillUnmount() {
        EventBus.remove("logout");
    }

    render() {
        return (
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<FrontPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard/:userId" element={<Dashboard />} />
                    <Route
                        path="/dashboard/:userId/settings"
                        element={<Settings />}
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        );
    }
}

export default App;
