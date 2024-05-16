import express from 'express'
import {
    getAllNotepads,
    getNotepadById,
    createNotepad,
    updateText,
    deleteNotepad
} from '../controllers/notepadController.js'

const router = express.Router()

// READ
router.get('/all', getAllNotepads)
router.get('/:id', getNotepadById)

// CREATE
router.post('/:id', createNotepad)

// UPDATE
router.put('/:id', updateText)

// DELETE
router.delete('/:id', deleteNotepad)

export default router
