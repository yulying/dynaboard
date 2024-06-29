import React from "react";
import Navbar from "./Navbar";
import { Routes, Route, useNavigate } from "react-router-dom";

export default function FrontPage() {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar frontPage={true} />
            <div id="main-header">
                <h1 id="main-statement">Create your own dashboard, your way</h1>
                <h3 id="sub-statement">
                    Personalize your information hub for free today.
                </h3>
                <button
                    id="front-login-button"
                    onClick={() => navigate("/login")}
                >
                    Create a new account or login
                </button>
            </div>
            <div id="sub-header">
                <h2>Being organized shouldn't need to be a confusing chore.</h2>
                <br />
                <h3 className="informational-text">
                    Need to keep multiple tabs open at once and and slow down
                    CPU performance? Tried to use an online dashboard to
                    organize everything but find there is too much extra
                    information you don't care about?
                </h3>
                <br />
                <h3 className="informational-text">
                    Dynamic Dashboard is a free-to-use solution that allows you
                    to personally cater your dashboard using only the
                    information you want. Customize your dashboard with many
                    different options of keeping track of your information to
                    choose from, import data from external sources, and most
                    importantly, keep it all in one place.
                </h3>
            </div>
            <div id="main-page-footer">
                <a
                    id="suggestions-feedback-form"
                    href="https://forms.gle/vwV8LPHZY1AwwxnE7"
                >
                    Send suggestions here!
                </a>
                <a id="github-link" href="https://forms.gle/vwV8LPHZY1AwwxnE7">
                    GitHub
                </a>
            </div>
        </div>
    );
}
