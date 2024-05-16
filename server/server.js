import express from 'express'
import { getAll, getAllTypes } from './controllers/sectionController.js'
import sections from './routes/sections.js'
import notepad from './routes/notepad.js'
import checklist from './routes/checklist.js'
import logger from './middleware/logger.js'

const PORT = process.env.PORT || 8000

const app = express()

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Logger middleware
app.use(logger)

app.use('/all', getAll)
app.use('/type', getAllTypes)

// Routes
app.use('/sections', sections)
app.use('/notepad', notepad)
app.use('/checklist', checklist)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
