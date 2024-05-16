import express from 'express'
import {
    getAllChecklists,
    getChecklistById,
    getCheckboxById,
    createChecklist,
    createCheckbox,
    updateText,
    updateCheck,
    deleteCheckbox,
    deleteChecklist
} from '../controllers/checklistController.js'

const router = express.Router()

// READ
router.get('/all', getAllChecklists)
router.get('/:id', getChecklistById)
router.get('/:id/checkbox/:checkbox_id', getCheckboxById)

// CREATE
router.post('/:id', createChecklist)
router.post('/:id/checkbox/:checkbox_id', createCheckbox)

// UPDATE
router.put('/:id/checkbox/:checkbox_id', updateText)
router.put(':id/checkbox/:checkbox_id/check/:checked', updateCheck)

// DELETE
router.delete('/:id', deleteChecklist)
router.delete('/:id/checkbox/:checkbox_id', deleteCheckbox)

export default router
