import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { getAll, getAllTypes } from "./controllers/sectionController.js";
import sections from "./routes/sections.js";
import notepad from "./routes/notepad.js";
import checklist from "./routes/checklist.js";
import googleapis from "./routes/googleapis.js";
import logger from "./middleware/logger.js";

const PORT = process.env.PORT;
const DASHBOARD_PORT = 5173;

const corsOptions = {
    origin: `http://localhost:${DASHBOARD_PORT}`,
};

const app = express();

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: `http://localhost:${DASHBOARD_PORT}` },
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger middleware
app.use(logger);

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

app.use("/api/all", getAll);
app.use("/api/type", getAllTypes);

// Routes
app.use("/api/sections", sections);
app.use("/api/notepad", notepad);
app.use("/api/checklist", checklist);

app.use("/api/google", googleapis);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
