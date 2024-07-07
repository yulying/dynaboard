import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import https from "https";
import fs from "fs";
import { verifyToken } from "./middleware/authJwt.js";
import { getAll, getAllTypes } from "./controllers/sectionController.js";
import auth from "./routes/auth.js";
import sections from "./routes/sections.js";
import notepad from "./routes/notepad.js";
import checklist from "./routes/checklist.js";
import googleapis from "./routes/googleapis.js";
import logger from "./middleware/logger.js";

const PORT = process.env.PORT;
// const DASHBOARD_PORT = 5173;

// const corsOptions = {
//     origin: `http://localhost:${DASHBOARD_PORT}`,
// };

const options = {
    key: fs.readFileSync(".cert/server.key"),
    cert: fs.readFileSync(".cert/server.cert"),
};

const app = express();

app.use(
    cors({
        origin: true,
    }),
);

const server = https.createServer(options, app);
const io = new Server(server, {
    cors: {
        origin: true,
    },
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger middleware
// app.use(logger);

io.sockets.on("connection", function (socket) {
    console.log("Client connected.");
    socket.on("echo", function (data) {
        io.sockets.emit("message", data);
    });
});

// Make io accessible to our router
app.use(function (req, res, next) {
    req.io = io;
    next();
});

app.use("/api/auth", auth);

app.get("/api/:user_id/all", [verifyToken], getAll);
app.get("/api/:user_id/type", [verifyToken], getAllTypes);

app.use("/api/:user_id/sections", sections);
app.use("/api/:user_id/notepad", notepad);
app.use("/api/:user_id/checklist", checklist);
app.use("/api/:user_id/google", googleapis);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
