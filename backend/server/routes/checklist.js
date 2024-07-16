import express from "express";
import { verifyToken } from "../middleware/authJwt.js";
import {
    getAllChecklists,
    getChecklistById,
    getCheckboxById,
    getLargestCheckboxId,
    hasCheckboxId,
    createChecklist,
    createCheckbox,
    updateText,
    updateCheck,
    deleteChecklist,
    deleteCheckboxId,
    deleteEmptyCheckbox,
} from "../controllers/checklistController.js";

const router = express.Router({ mergeParams: true });

// READ
router.get("/all", [verifyToken], getAllChecklists);
router.get("/:section_id", [verifyToken], getChecklistById);
router.get(
    "/:section_id/checkbox/:checkbox_id",
    [verifyToken],
    getCheckboxById,
);
router.get(
    "/:section_id/checkbox/:checkbox_id/has_id",
    [verifyToken],
    hasCheckboxId,
);

// CREATE
router.post("/:section_id", [verifyToken], createChecklist);
router.post(
    "/:section_id/checkbox/:checkbox_id",
    [verifyToken],
    createCheckbox,
);

// UPDATE
router.put("/:section_id/checkbox/:checkbox_id", [verifyToken], updateText);
router.put(
    "/:section_id/checkbox/:checkbox_id/check/:checked",
    [verifyToken],
    updateCheck,
);

// DELETE
router.delete("/:section_id", [verifyToken], deleteChecklist);
router.delete(
    "/:section_id/checkbox/:checkbox_id",
    [verifyToken],
    deleteCheckboxId,
);
router.delete(
    "/:section_id/delete_empty_checkbox",
    [verifyToken],
    deleteEmptyCheckbox,
);

export default router;
