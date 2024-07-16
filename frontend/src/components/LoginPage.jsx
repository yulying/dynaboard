import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "./Navbar";
import authService from "../utils/authService";
import tokenService from "../utils/tokenService";

import { isEmail } from "validator";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [newEmail, setNewEmail] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [userInput, setUserInput] = useState(false);

    const navigate = useNavigate();

    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        try {
            api.get(`auth/${tokenService.getUser().userId}/token`)
                .then((response) => {
                    navigate(`/dashboard/` + currentUser.userId);
                })
                .catch((error) => {
                    console.log("Access token expired.");
                    authService.logout(userId);
                });
        } catch (error) {
            console.log("No current user found.");
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        const data = await authService.login(username, password);

        if (data.accessToken) {
            navigate(`/dashboard/` + data.userId);
        } else {
            alert("Incorrect username and/or password.");
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();

        if (!isEmail(newEmail)) {
            alert("Please input a valid email.");
            return;
        }
        if (newUsername.length < 6 || newUsername.length > 30) {
            alert("Username must be 6-30 characters.");
            return;
        }
        if (newPassword.length < 8 || newPassword.length > 30) {
            alert("Password must be 8-30 characters.");
            return;
        }
        if (newPassword !== repeatPassword) {
            alert("Passwords do not match.");
            return;
        }

        await authService.register(newUsername, newEmail, newPassword);

        setNewEmail("");
        setNewUsername("");
        setNewPassword("");
        setRepeatPassword("");
        alert("Account successfully created! Please log in.");
    };

    return (
        <div id="credentials-container">
            <Navbar frontPage={true} />
            <div id="login-container">
                <form id="login-form" onSubmit={handleLogin}>
                    <h3 id="login-title">Log In</h3>
                    <div className="account-input">
                        <label className="prompt-label" htmlFor="username">
                            Username:
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="account-input">
                        <label className="prompt-label" htmlFor="password">
                            Password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button id="login-button" type="submit">
                        Log In
                    </button>
                </form>
            </div>
            <div className="vl"></div>
            <div id="or">OR</div>
            <div id="new-account-container">
                <form id="create-account-form" onSubmit={handleCreateAccount}>
                    <h3 id="create-account-title">Create a new account</h3>
                    <div className="account-input">
                        <label className="prompt-label" htmlFor="new-email">
                            Email:
                        </label>
                        <input
                            id="new-email"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                    </div>
                    <div className="account-input">
                        <label className="prompt-label" htmlFor="new-username">
                            Username (6-30 Characters):
                        </label>
                        <input
                            id="new-username"
                            type="text"
                            maxLength="30"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                        />
                    </div>
                    <div className="account-input">
                        <label className="prompt-label" htmlFor="new-password">
                            Password (8-30 Characters):
                        </label>
                        <input
                            id="new-password"
                            type="password"
                            maxLength="30"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="account-input">
                        <label
                            className="prompt-label"
                            htmlFor="repeat-password"
                        >
                            Repeat Password:
                        </label>
                        <input
                            id="repeat-password"
                            type="password"
                            value={repeatPassword}
                            onChange={(e) => {
                                setRepeatPassword(e.target.value);
                                setUserInput(true);
                            }}
                        />
                    </div>
                    {newPassword !== repeatPassword && userInput && (
                        <p id="invalid-repeat-pass">Passwords do not match!</p>
                    )}
                    <button id="sign-up-button" type="submit">
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}
