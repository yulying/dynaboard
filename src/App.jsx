import React from "react";
import Dashboard from "./components/Dashboard";
import { io } from "socket.io-client";

export const socket = io(`http://localhost:${import.meta.env.VITE_PORT}`);

function App() {
    return (
        <div className="container">
            <Dashboard socket={socket} />
        </div>
    );
}

export default App;
