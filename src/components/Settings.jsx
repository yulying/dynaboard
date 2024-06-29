import React from "react";

export default function Settings() {
    const handleLogout = () => {
        console.log("Log out function to be implemented.");
    };

    return (
        <div>
            <nav className="dashboard-navbar">
                <h3 className="dashboard-title">My Dashboard</h3>
                <div className="dashboard-editor">
                    <span className="dashboard-settings">BACK</span>
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
