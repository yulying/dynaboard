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
export const getAllNotepads = async (req, res, next) => {
    const query = 'SELECT * FROM notepad ORDER BY n_sec_id'

    const result = await pool.query(query)

    res.status(200).json(result.rows)
}

// @desc    Get notepad by id
// @route   GET /notepad/:id
export const getNotepadById = async (req, res, next) => {
    const query = 'SELECT * FROM notepad WHERE n_sec_id = $1'
    const values = [parseInt(req.params.id)]

    const result = await pool.query(query, values)

    res.status(200).json(result.rows)
}

// @desc    Create new notepad
// POST     /notepad/:id
export const createNotepad = async (req, res, next) => {
    const query = 'INSERT INTO notepad (n_sec_id) VALUES ($1)'
    const values = [parseInt(req.params.id)]

    const result = await pool.query(query, values)

    res.status(200).json(result.rows)
}

// @desc    Update notepad text
// @route   UPDATE /notepad/:id
export const updateText = async (req, res, next) => {
    const query = 'UPDATE notepad SET v_text = $1 WHERE n_sec_id = $2'
    const values = [req.body.text, parseInt(req.params.id)]

    // console.log(req.body)

    const result = await pool.query(query, values)

    res.status(200).json(result.rows)
}

// @desc    Delete notepad
// @route   DELETE /notepad/:id
export const deleteNotepad = async (req, res, next) => {
    const query = `DELETE FROM notepad WHERE n_sec_id = $1`
    const values = [parseInt(req.params.id)]

    const result = await pool.query(query, values)

    res.status(200).json(result.rows)
}
