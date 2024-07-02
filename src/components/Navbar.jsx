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
                            onClick={() => navigate(`/dashboard` + userId)}
                        >
                            My Dashboard
                        </h3>
                    )}

                    {props.frontPage && !props.notFound && (
                        <span
                            id="navbar-login-button"
                            onClick={() => navigate("/login")}
                        >
                            LOGIN
                        </span>
                    )}
                    {!props.frontPage && !props.notFound && (
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
                                        navigate(
                                            `/dashboard/` +
                                                userId +
                                                `/settings`,
                                        )
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
