import React, { useContext, useState } from "react";
import Navbar from "./Navbar";
import { AuthContext } from "../utils/AuthContext";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [newEmail, setNewEmail] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [userInput, setUserInput] = useState(false);

    const { setToken } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        await fetch(
            `http://localhost:${import.meta.env.VITE_PORT}/dashboard/login`,
            {
                method: "POST",
                headers: new Headers({
                    "Content-type": "application/json; charset=UTF-8",
                }),
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            },
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.result === "fail") {
                    alert("Invalid username and/or password.");
                    setToken(null);
                    localStorage.removeItem("token");
                    return;
                }

                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
            })
            .catch((error) => {
                console.error("Authentication failed:", error);
                setToken(null);
                localStorage.removeItem("token");
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data); // Set the error message if present in the error response
                } else {
                    setErrorMessage(
                        "An unexpected error occurred. Please try again.",
                    );
                }
            });
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();

        if (newEmail.length < 10) {
            alert("Please input a valid email.");
            return;
        }
        if (newUsername.length < 6) {
            alert("Username must be at least 6 characters.");
            return;
        }
        if (newPassword.length < 8) {
            alert("Passwords must be at least 8 characters.");
            return;
        }
        if (newPassword !== repeatPassword) {
            alert("Passwords do not match.");
            return;
        }

        await fetch(
            `http://localhost:${import.meta.env.VITE_PORT}/dashboard/signup`,
            {
                method: "POST",
                headers: new Headers({
                    "Content-type": "application/json; charset=UTF-8",
                }),
                body: JSON.stringify({
                    username: newUsername,
                    email: newEmail,
                    password: newPassword,
                }),
            },
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.result === "fail") {
                    alert("Username invalid or already taken.");
                } else {
                    setNewEmail("");
                    setNewUsername("");
                    setNewPassword("");
                    setRepeatPassword("");
                    alert("Account successfully created! Please log in.");
                }
            })
            .catch((error) => console.log(error));
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
