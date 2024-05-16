import pg from 'pg'

const pool = new pg.Pool({
    user: process.env.POSTGRES_DB_USER,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_DB_PASS,
    port: process.env.POSTGRES_DB_PORT
})

// @desc    Get all checklists
// @route   GET /checklist/all
export const getAllChecklists = (req, res, next) => {
    const query = 'SELECT * FROM checklist'
    pool.query(query, (error, results) => {
        if (error) {
            return next(error)
        }

        res.status(200).json(results.rows)
    })
}

// @desc    Get checklist by id
// @route   GET /checklist/:id/checkbox
export const getChecklistById = (req, res, next) => {
    const query = 'SELECT * FROM checklist WHERE n_sec_id = $1'
    const values = [parseInt(req.params.id)]

    pool.query(query, values, (error, results) => {
        if (error) {
            return next(error)
        }

        res.status(200).json(results.rows)
    })
}

// @desc    Get checkbox by id
// @route   GET /checklist/:id/checkbox/:checkbox_id
export const getCheckboxById = (req, res, next) => {
    const query = 'SELECT * FROM checklist WHERE n_sec_id = $1 and n_checkbox_id = $2'
    const values = [parseInt(req.params.id), parseInt(req.params.checkbox_id)]

    pool.query(query, values, (error, results) => {
        if (error) {
            return next(error)
        }

        res.status(200).json(results.rows)
    })
}

// @desc    Create new checklist
// POST     /checklist/:id
export const createChecklist = (req, res, next) => {
    const query = 'INSERT INTO checklist (n_sec_id) VALUES ($1)'
    const values = [parseInt(req.params.id)]

    pool.query(query, values, (error, results) => {
        if (error) {
            return next(error)
        }

        res.status(200).json(results.rows)
    })
}

// @desc    Create new checkbox
// POST     POST /checklist/:id/checkbox/:checkbox_id
export const createCheckbox = (req, res, next) => {
    const query = 'INSERT INTO checklist (n_sec_id, n_checkbox_id) VALUES ($1, $2)'
    const values = [parseInt(req.params.id), parseInt(req.params.checkbox_id)]

    pool.query(query, values, (error, results) => {
        if (error) {
            return next(error)
        }

        res.status(200).json(results.rows)
    })
}

// @desc    Update checkbox text
// @route   UPDATE /checklist/:id/checkbox/:checkbox_id
export const updateText = async (req, res, next) => {
    const query = 'UPDATE checklist SET v_text = $1 WHERE n_sec_id = $2 and n_checkbox_id = $3'
    const values = [req.body.text, parseInt(req.params.id), parseInt(req.params.checkbox_id)]

    pool.query(query, values, (error, results) => {
        if (error) {
            return next(error)
        }

        res.status(200).json(results.rows)
    })
}

// @desc    Update checklist check box
// @route   UPDATE /checklist/:id/checkbox/:checkbox_id/check/:checked
export const updateCheck = async (req, res, next) => {
    const query = 'UPDATE checklist SET is_checked = $1 WHERE n_sec_id = $2 and n_checkbox_id = $3'
    const values = [req.params.checked, parseInt(req.params.id), parseInt(req.params.checkbox_id)]

    pool.query(query, values, (error, results) => {
        if (error) {
            return next(error)
        }

        res.status(200).json(results.rows)
    })
}

// @desc    Delete checklist
// @route   DELETE /checklist/:id
export const deleteChecklist = (req, res, next) => {
    const query = `DELETE FROM checklist WHERE n_sec_id = $1`
    const values = [parseInt(req.params.id)]

    pool.query(query, values, (error, results) => {
        if (error) {
            return next(error)
        }

        res.status(200).json(results.rows)
    })
}

// @desc    Delete checkbox
// @route   DELETE /checklist/:id/checkbox/:checkbox_id
export const deleteCheckbox = (req, res, next) => {
    const query = `DELETE FROM checklist WHERE n_sec_id = $1 and n_checkbox_id = $2`
    const values = [parseInt(req.params.id), parseInt(req.params.checkbox_id)]

    pool.query(query, values, (error, results) => {
        if (error) {
            return next(error)
        }

        res.status(200).json(results.rows)
    })
}
