import React from "react";
import Navbar from "./Navbar";

export default function NotFound() {
    return (
        <div>
            <Navbar frontPage notFound />
            <div id="not-found">
                <h1>404 Page Not Found</h1>
            </div>
        </div>
    );
}
