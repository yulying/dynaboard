import pg from "pg";

const pool = new pg.Pool({
    user: process.env.POSTGRES_DB_USER,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_DB_PASS,
    port: process.env.POSTGRES_DB_PORT,
});

export const getAllChecklists = async (req, res, next) => {
    const query =
        "SELECT * FROM checklist WHERE user_id = $1 ORDER BY section_id";
    const values = [req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const getChecklistById = async (req, res, next) => {
    const query =
        "SELECT * FROM checklist WHERE section_id = $1 and user_id = $2 ORDER BY checkbox_id";
    const values = [parseInt(req.params.section_id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const getCheckboxById = async (req, res, next) => {
    const query =
        "SELECT * FROM checklist WHERE section_id = $1 and checkbox_id = $2 and user_id = $3"; // Add order by after populating with some checkboxes
    const values = [
        parseInt(req.params.section_id),
        parseInt(req.params.checkbox_id),
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const getLargestCheckboxId = async (req, res, next) => {
    const query =
        "SELECT coalesce((SELECT checkbox_id FROM checklist WHERE section_id = $1), 0) AS checkbox_id";
    const values = [parseInt(req.params.section_id)];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const hasCheckboxId = async (req, res, next) => {
    const query =
        "SELECT coalesce((SELECT true FROM checklist WHERE section_id = $1 and checkbox_id = $2 and user_id = $3), false) AS has_checkbox_id";

    const values = [
        parseInt(req.params.section_id),
        parseInt(req.params.checkbox_id),
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const createChecklist = async (req, res, next) => {
    const query = "INSERT INTO checklist (section_id, user_id) VALUES ($1, $2)";
    const values = [parseInt(req.params.section_id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const createCheckbox = async (req, res, next) => {
    const query =
        "INSERT INTO checklist (section_id, checkbox_id, user_id) VALUES ($1, $2, $3)";
    const values = [
        parseInt(req.params.section_id),
        parseInt(req.params.checkbox_id),
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const updateText = async (req, res, next) => {
    const query =
        "UPDATE checklist SET text = $1 WHERE section_id = $2 and checkbox_id = $3 and user_id = $4";
    const values = [
        req.body.text,
        parseInt(req.params.section_id),
        parseInt(req.params.checkbox_id),
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const updateCheck = async (req, res, next) => {
    const query =
        "UPDATE checklist SET is_checked = $1 WHERE section_id = $2 and checkbox_id = $3 and user_id = $4";
    const values = [
        req.params.checked === "true",
        parseInt(req.params.section_id),
        parseInt(req.params.checkbox_id),
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const deleteChecklist = async (req, res, next) => {
    const query = `DELETE FROM checklist WHERE section_id = $1 and user_id = $2`;
    const values = [parseInt(req.params.section_id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const deleteCheckboxId = async (req, res, next) => {
    const query = `DELETE FROM checklist WHERE section_id = $1 and checkbox_id = $2 and user_id = $3`;
    const values = [
        parseInt(req.params.section_id),
        parseInt(req.params.checkbox_id),
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const deleteEmptyCheckbox = async (req, res, next) => {
    const query = `DELETE FROM checklist WHERE section_id = $1 and user_id = $2 and (text = '' OR text is NULL)`;
    const values = [parseInt(req.params.section_id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};
