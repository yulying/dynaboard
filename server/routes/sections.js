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
router.get("/id/:section_id", [verifyToken], getSectionById);
router.get("/type/:section_type", [verifyToken], getSectionByType);

// CREATE
router.post("/:section_id/type/:section_type", [verifyToken], createSection);

// UPDATE
router.put("/:section_id/type/:section_type", [verifyToken], updateSection);
router.put(
    "/:section_id/label/:section_label",
    [verifyToken],
    updateSectionLabel,
);

// DELETE
router.delete("/:section_id", [verifyToken], deleteSection);

export default router;
