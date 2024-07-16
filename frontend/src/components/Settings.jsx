import React, { useEffect } from "react";
import authService from "../utils/authService";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

export default function Settings() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        authService.logout(userId);
        alert("You've been logged out. Redirecting...");
        navigate("/");
    };

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || currentUser.userId !== userId) navigate("/");
    }, []);

    return (
        <div>
            <Navbar settings />
            <div id="settings-div">
                <ul id="settings-ul">
                    <li>Change Layout</li>
                    <li>Change color scheme</li>
                    <li>Delete Account</li>
                </ul>
                <button id="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
