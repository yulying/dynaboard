import pg from "pg";

const pool = new pg.Pool({
    user: process.env.POSTGRES_DB_USER,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_DB_PASS,
    port: process.env.POSTGRES_DB_PORT,
});

// @desc    Get all notepads
// @route   GET /notepad/all
export const getAllNotepads = async (req, res, next) => {
    const query = "SELECT * FROM notepad WHERE user_id = $1 ORDER BY n_sec_id";
    const values = [req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
};

// @desc    Get notepad by id
// @route   GET /notepad/:id
export const getNotepadById = async (req, res, next) => {
    const query = "SELECT * FROM notepad WHERE n_sec_id = $1 and user_id = $2";
    const values = [parseInt(req.params.id), req.param.user_id];

    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
};

// @desc    Create new notepad
// POST     /notepad/:id
export const createNotepad = async (req, res, next) => {
    const query = "INSERT INTO notepad (n_sec_id, user_id) VALUES ($1, $2)";
    const values = [parseInt(req.params.id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
};

// @desc    Update notepad text
// @route   UPDATE /notepad/:id
export const updateText = async (req, res, next) => {
    const query =
        "UPDATE notepad SET v_text = $1 WHERE n_sec_id = $2 and user_id = $3";
    const values = [req.body.text, parseInt(req.params.id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
};

// @desc    Delete notepad
// @route   DELETE /notepad/:id
export const deleteNotepad = async (req, res, next) => {
    const query = `DELETE FROM notepad WHERE n_sec_id = $1 and user_id = $2`;
    const values = [parseInt(req.params.id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
};
