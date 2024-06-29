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
router.get("/:id", [verifyToken], getChecklistById);
router.get("/:id/checkbox/:checkbox_id", [verifyToken], getCheckboxById);
// router.get("/:id/largest_checkbox_id", getLargestCheckboxId);
router.get("/:id/checkbox/:checkbox_id/has_id", [verifyToken], hasCheckboxId);

// CREATE
router.post("/:id", [verifyToken], createChecklist);
router.post("/:id/checkbox/:checkbox_id", [verifyToken], createCheckbox);

// UPDATE
router.put("/:id/checkbox/:checkbox_id", [verifyToken], updateText);
router.put(
    "/:id/checkbox/:checkbox_id/check/:checked",
    [verifyToken],
    updateCheck,
);

// DELETE
router.delete("/:id", [verifyToken], deleteChecklist);
router.delete("/:id/checkbox/:checkbox_id", [verifyToken], deleteCheckboxId);
router.delete("/:id/delete_empty_checkbox", [verifyToken], deleteEmptyCheckbox);

export default router;
