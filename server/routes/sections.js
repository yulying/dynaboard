import express from "express";
import Router from "express-promise-router";
import { verifyToken } from "../middleware/authJwt.js";
import {
    getLargestSectionId,
    getSectionById,
    getSectionByType,
    createSection,
    updateSection,
    updateSectionLabel,
    deleteSection,
} from "../controllers/sectionController.js";

const router = new Router({ mergeParams: true });

// READ
router.get("/largest_id", [verifyToken], getLargestSectionId);
router.get("/id/:id", [verifyToken], getSectionById);
router.get("/type/:type", [verifyToken], getSectionByType);

// CREATE
router.post("/:id/type/:type", [verifyToken], createSection);

// UPDATE
router.put("/:id/type/:type", [verifyToken], updateSection);
router.put("/:id/label/:label", [verifyToken], updateSectionLabel);

// DELETE
router.delete("/:id", [verifyToken], deleteSection);

export default router;
