import express from "express";
import { verifyToken } from "../middleware/authJwt.js";
import {
    getAllNotepads,
    getNotepadById,
    createNotepad,
    updateText,
    deleteNotepad,
} from "../controllers/notepadController.js";

const router = express.Router({ mergeParams: true });

// READ
router.get("/all", [verifyToken], getAllNotepads);
router.get("/:id", [verifyToken], getNotepadById);

// CREATE
router.post("/:id", [verifyToken], createNotepad);

// UPDATE
router.put("/:id", [verifyToken], updateText);

// DELETE
router.delete("/:id", [verifyToken], deleteNotepad);

export default router;
