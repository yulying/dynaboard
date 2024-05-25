import React from "react";

export default function Settings() {
    return (
        <div>
            <nav className="dashboard-navbar">
                <h3 className="dashboard-title">My Dashboard</h3>
                <div className="dashboard-editor">
                    <span className="dashboard-settings">RETURN</span>
                </div>
            </nav>
            <ul>
                <li>Change Layout</li>
                <li>Change color scheme</li>
                <li>Delete Account</li>
            </ul>
        </div>
        
    )
}