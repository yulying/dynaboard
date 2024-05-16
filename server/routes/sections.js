import express from 'express'
import {
    getSectionById,
    getSectionByType,
    createSection,
    updateSection,
    deleteSection
} from '../controllers/sectionController.js'

const router = express.Router()

// READ
router.get('/id/:id', getSectionById)
router.get('/type/:type', getSectionByType)

// CREATE
router.post('/:id/type/:type', createSection)

// UPDATE
router.put('/:id/type/:type', updateSection)

// DELETE
router.delete('/:id', deleteSection)

export default router
