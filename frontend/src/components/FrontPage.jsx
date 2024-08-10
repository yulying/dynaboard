import React from "react";
import Navbar from "./Navbar";
import { Routes, Route, useNavigate } from "react-router-dom";
import FrontImage from "./../assets/images/pexels-jessbaileydesign-notepad.jpg";
import WashiTape from "./../assets/images/dark-blue-tape.png";
import DotsDeco from "./../assets/images/dots.png";
import FirstSample from "./../assets/images/sample1.png";
import SecondSample from "./../assets/images/sample2.png";

import tapeArr from "../utils/tape";

export default function FrontPage() {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar frontPage />
            <img src={DotsDeco} id="dots-deco" />
            <img src={FrontImage} id="front-image" />
            <div id="main-header">
                <h1 className="main-statement">Create your own dashboard,</h1>
                <h1 className="main-statement">your way.</h1>
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
            <div id="sub-header-container">
                <img src={tapeArr[1]} id="washi-tape" />
                <div id="sub-header">
                    <h2 id="sub-header-title">
                        Being organized shouldn't need to be a confusing chore.
                    </h2>
                    <br />
                    <h3 className="informational-text">
                        Need to keep multiple tabs open at once and and slow
                        down CPU performance? Tried to use an online dashboard
                        to organize everything but find there is too much extra
                        information you don't care about?
                    </h3>
                    <h3 className="informational-text">
                        Oftentimes, we spend more time making sure everything is
                        neat and organized, not by your standards but limited to
                        software limitations...
                    </h3>
                    <h3 className="informational-text">
                        Dynamic Dashboard is a free-to-use solution that allows
                        you to personally tailor your dashboard using only the
                        information you want. Customize your dashboard with many
                        different options to choose from, import data from
                        external sources, and most importantly, keep it all in
                        one place made just for you.
                    </h3>
                </div>
            </div>
            <div id="first-sample-div">
                <div className="sample-img-wrap">
                    <img src={FirstSample} id="first-sample-img" />
                </div>
                <div id="first-sample-text-div">
                    <img src={tapeArr[4]} id="first-sample-tape" />
                    <h2 id="first-sample-title">Embrace your needs...</h2>
                    <h3 className="first-sample-text">
                        Your dashboard is a tool designed to help you keep track
                        of information that is important to you. Just like how
                        someone may study better with flashcards and another may
                        need to watch videos, there is no one right dashboard
                        layout!
                    </h3>
                    <h3 className="first-sample-text">
                        Dynamic Dashboard adheres to this idea and makes it
                        possible.
                    </h3>
                </div>
            </div>
            <div id="second-sample-div">
                <div className="sample-img-wrap">
                    <img src={SecondSample} id="second-sample-img" />
                    <figcaption id="second-sample-caption">
                        More options are currently being developed and may not
                        be an exact representation of final product!
                    </figcaption>
                </div>

                <div id="second-sample-text-div">
                    <img src={tapeArr[0]} id="second-sample-tape" />
                    <h2 id="second-sample-title">Customizations galore...</h2>
                    <h3 id="second-sample-text">
                        Add, change or delete sections to cater to your own
                        needs at any time. Change your labels to add an extra
                        personal touch to your dashboard. Organizing your notes
                        and thoughts has never been easier!
                    </h3>
                </div>
            </div>
            <div id="main-page-footer">
                <a
                    id="suggestions-feedback-form"
                    href="https://forms.gle/vwV8LPHZY1AwwxnE7"
                >
                    Send suggestions here!
                </a>
                <a id="github-link" href="https://github.com/yulying/dynaboard">
                    GitHub
                </a>
            </div>
        </div>
    );
}
