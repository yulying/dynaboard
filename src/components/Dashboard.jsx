import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import authService from "../utils/authService";

import Navbar from "./Navbar";
import Sections from "./Sections";
import Footer from "./Footer";

export default function Dashboard() {
    const [clickableBox, setClickableBox] = useState(false);
    const [status, setStatus] = useState("No recent changes made.");

    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || currentUser.userId !== userId) navigate("/");
    }, []);

    return (
        <div>
            <Navbar
                clickableBox={clickableBox}
                toggleClickableBox={() =>
                    setClickableBox((prevClickableBox) => !prevClickableBox)
                }
            />
            <Sections
                clickableBox={clickableBox}
                setStatusBar={(newStatus) => setStatus(newStatus)}
            />
            <Footer status={status} />
        </div>
    );
}
