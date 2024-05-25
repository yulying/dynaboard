import express from "express";
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

const router = express.Router();

// READ
router.get("/all", getAllChecklists);
router.get("/:id", getChecklistById);
router.get("/:id/checkbox/:checkbox_id", getCheckboxById);
router.get("/:id/largest_checkbox_id", getLargestCheckboxId);
router.get("/:id/checkbox/:checkbox_id/has_id", hasCheckboxId);

// CREATE
router.post("/:id", createChecklist);
router.post("/:id/checkbox/:checkbox_id", createCheckbox);

// UPDATE
router.put("/:id/checkbox/:checkbox_id", updateText);
router.put("/:id/checkbox/:checkbox_id/check/:checked", updateCheck);

// DELETE
router.delete("/:id", deleteChecklist);
router.delete("/:id/checkbox/:checkbox_id", deleteCheckboxId);
router.delete("/:id/delete_empty_checkbox", deleteEmptyCheckbox);

export default router;
