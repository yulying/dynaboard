import express from "express";
import Router from "express-promise-router";
import {
    getLargestSectionId,
    getSectionById,
    getSectionByType,
    createSection,
    updateSection,
    updateSectionLabel,
    deleteSection,
} from "../controllers/sectionController.js";

const router = new Router();

// READ
router.get("/largest_id", getLargestSectionId);
router.get("/id/:id", getSectionById);
router.get("/type/:type", getSectionByType);

// CREATE
router.post("/:id/type/:type", createSection);

// UPDATE
router.put("/:id/type/:type", updateSection);
router.put("/:id/label/:label", updateSectionLabel);

// DELETE
router.delete("/:id", deleteSection);

export default router;
