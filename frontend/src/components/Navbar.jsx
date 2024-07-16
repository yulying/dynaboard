import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Navbar(props) {
    const navigate = useNavigate();
    const { userId } = useParams();

    return (
        <div>
            <div id="navbar-empty-space" />
            <div id="navbar">
                <nav id="main-navbar-components">
                    {props.frontPage && (
                        <h3
                            className="dashboard-title"
                            onClick={() => navigate("/")}
                        >
                            Dynamic Dashboard
                        </h3>
                    )}

                    {!props.frontPage && (
                        <h3
                            className="dashboard-title"
                            onClick={() => navigate(`/dashboard/` + userId)}
                        >
                            My Dashboard
                        </h3>
                    )}

                    {props.frontPage && !props.notFound && !props.settings && (
                        <div className="dashboard-editor">
                            <button
                                id="navbar-login-button"
                                onClick={() => navigate("/login")}
                            >
                                LOGIN
                            </button>
                        </div>
                    )}
                    {!props.frontPage && !props.notFound && !props.settings && (
                        <div className="dashboard-editor">
                            <button
                                id="edit-button"
                                onClick={props.toggleClickableBox}
                            >
                                {props.clickableBox ? "DONE" : "EDIT"}
                            </button>
                            {!props.clickableBox && (
                                <button
                                    id="dashboard-settings-button"
                                    onClick={() =>
                                        navigate(
                                            `/dashboard/` +
                                                userId +
                                                `/settings`,
                                        )
                                    }
                                >
                                    SETTINGS
                                </button>
                            )}
                        </div>
                    )}
                    {!props.frontPage && !props.notFound && props.settings && (
                        <div className="dashboard-editor">
                            <button
                                id="back-to-dashboard-button"
                                onClick={() => navigate(`/dashboard/` + userId)}
                            >
                                BACK TO DASHBOARD
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </div>
    );
}
