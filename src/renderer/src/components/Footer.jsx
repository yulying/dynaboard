import React from "react";

export default function Footer() {
    const [status, setStatus] = React.useState({
        status: "Set Status Here"
    })

    return (
        <div>
            <div id='footer-empty-space' />
            <div id="footer">
                <nav id="main-footer-components">
                    <span>Version 1.0</span>
                    <span>{ status.status }</span>
                </nav>
            </div>
        </div>
       
    )
}