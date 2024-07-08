import pg from "pg";

const pool = new pg.Pool({
    user: process.env.POSTGRES_DB_USER,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_DB_PASS,
    port: process.env.POSTGRES_DB_PORT,
});

export const getAllNotepads = async (req, res, next) => {
    const query =
        "SELECT * FROM notepad WHERE user_id = $1 ORDER BY section_id";
    const values = [req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
};

export const getNotepadById = async (req, res, next) => {
    const query =
        "SELECT * FROM notepad WHERE section_id = $1 and user_id = $2";
    const values = [parseInt(req.params.section_id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
};

export const createNotepad = async (req, res, next) => {
    const query = "INSERT INTO notepad (section_id, user_id) VALUES ($1, $2)";
    const values = [parseInt(req.params.section_id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
};

export const updateText = async (req, res, next) => {
    const query =
        "UPDATE notepad SET v_text = $1 WHERE section_id = $2 and user_id = $3";
    const values = [
        req.body.text,
        parseInt(req.params.section_id),
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
};

export const deleteNotepad = async (req, res, next) => {
    const query = `DELETE FROM notepad WHERE section_id = $1 and user_id = $2`;
    const values = [parseInt(req.params.section_id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
};
