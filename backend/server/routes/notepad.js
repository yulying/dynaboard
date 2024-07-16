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
router.get("/:section_id", [verifyToken], getNotepadById);

// CREATE
router.post("/:section_id", [verifyToken], createNotepad);

// UPDATE
router.put("/:section_id", [verifyToken], updateText);

// DELETE
router.delete("/:section_id", [verifyToken], deleteNotepad);

export default router;
