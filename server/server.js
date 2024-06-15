import express from "express";
import cors from "cors";
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

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger middleware
app.use(logger);

app.use("/api/all", getAll);
app.use("/api/type", getAllTypes);

// Routes
app.use("/api/sections", sections);
app.use("/api/notepad", notepad);
app.use("/api/checklist", checklist);

app.use("/api/google", googleapis);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
