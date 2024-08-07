import React from "react";

export default function Footer(props) {
    return (
        <div>
            <div id="footer-empty-space" />
            <div id="footer">
                <nav id="main-footer-components">
                    <span>{props.status}</span>
                </nav>
            </div>
        </div>
    );
}
