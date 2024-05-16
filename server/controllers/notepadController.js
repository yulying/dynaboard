import pg from 'pg'

const pool = new pg.Pool({
    user: process.env.POSTGRES_DB_USER,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_DB_PASS,
    port: process.env.POSTGRES_DB_PORT
})

// @desc    Get all notepads
// @route   GET /notepad/all
export const getAllNotepads = (req, res, next) => {
    const query = 'SELECT * FROM notepad'
    pool.query(query, (error, results) => {
        if (error) {
            return next(error)
        }

        res.status(200).json(results.rows)
    })
}

// @desc    Get notepad by id
// @route   GET /notepad/:id
export const getNotepadById = (req, res, next) => {
    const query = 'SELECT * FROM notepad WHERE n_sec_id = $1'
    const values = [parseInt(req.params.id)]

    pool.query(query, values, (error, results) => {
        if (error) {
            return next(error)
        }

        res.status(200).json(results.rows)
    })
}

// @desc    Create new notepad
// POST     /notepad/:id
export const createNotepad = (req, res, next) => {
    const query = 'INSERT INTO notepad (n_sec_id) VALUES ($1)'
    const values = [parseInt(req.params.id)]

    pool.query(query, values, (error, results) => {
        if (error) {
            return next(error)
        }

        res.status(200).json(results.rows)
    })
}

// @desc    Update notepad text
// @route   UPDATE /notepad/:id
export const updateText = async (req, res, next) => {
    const query = 'UPDATE notepad SET v_text = $1 WHERE n_sec_id = $2'
    const values = [req.body.text, parseInt(req.params.id)]

    pool.query(query, values, (error, results) => {
        if (error) {
            return next(error)
        }

        res.status(200).json(results.rows)
    })
}

// @desc    Delete notepad
// @route   DELETE /notepad/:id
export const deleteNotepad = (req, res, next) => {
    const query = `DELETE FROM notepad WHERE n_sec_id = $1`
    const values = [parseInt(req.params.id)]

    pool.query(query, values, (error, results) => {
        if (error) {
            return next(error)
        }

        res.status(200).json(results.rows)
    })
}
