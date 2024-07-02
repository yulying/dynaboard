import React, { useState, useEffect } from "react";
import authService from "../utils/authService";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export default function Settings() {
    const [redirect, setRedirect] = useState("");

    const { userId } = useParams();
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        authService.logout(userId);
    };

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || currentUser.userId !== userId) navigate("/");
    }, []);

    return (
        <div>
            <nav className="dashboard-navbar">
                <h3 className="dashboard-title">My Dashboard</h3>
                <div className="dashboard-editor">
                    <span
                        className="dashboard-settings"
                        onClick={() => navigate(`/dashboard/` + userId)}
                    >
                        BACK TO DASHBOARD
                    </span>
                </div>
            </nav>
            <ul>
                <li>Change Layout</li>
                <li>Change color scheme</li>
                <li>Delete Account</li>
            </ul>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
