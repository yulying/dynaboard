import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

export default function Navbar(props) {
    const navigate = useNavigate();

    return (
        <div>
            <div id="navbar-empty-space" />
            <div id="navbar">
                <nav id="main-navbar-components">
                    <h3 id="dashboard-title">
                        {props.frontPage ? "Dynamic Dashboard" : "My Dashboard"}
                    </h3>
                    {props.frontPage && (
                        <span
                            id="navbar-login-button"
                            onClick={() => navigate("/login")}
                        >
                            LOGIN
                        </span>
                    )}
                    {!props.frontPage && (
                        <div id="dashboard-editor">
                            <span
                                id="edit-button"
                                onClick={props.toggleClickableBox}
                            >
                                {props.clickableBox ? "DONE" : "EDIT"}
                            </span>
                            {!props.clickableBox && (
                                <span
                                    className="dashboard-settings"
                                    onClick={() =>
                                        navigate("/dashboard/settings")
                                    }
                                >
                                    SETTINGS
                                </span>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </div>
    );
}
