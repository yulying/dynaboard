import pg from "pg";

const pool = new pg.Pool({
    user: process.env.POSTGRES_DB_USER,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_DB_PASS,
    port: process.env.POSTGRES_DB_PORT,
});

// @desc    Get all checklists
// @route   GET /checklist/all
export const getAllChecklists = async (req, res, next) => {
    const query = "SELECT * FROM checklist WHERE user_id = $1ORDER BY n_sec_id";
    const values = [req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

// @desc    Get checklist given a checklist id
// @route   GET /checklist/:id/checkbox
export const getChecklistById = async (req, res, next) => {
    const query =
        "SELECT * FROM checklist WHERE n_sec_id = $1 and user_id = $2 ORDER BY n_checkbox_id";
    const values = [parseInt(req.params.id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

// @desc    Get checkbox given a checklist id and checkbox id
// @route   GET /checklist/:id/checkbox/:checkbox_id
export const getCheckboxById = async (req, res, next) => {
    const query =
        "SELECT * FROM checklist WHERE n_sec_id = $1 and n_checkbox_id = $2 and user_id = $3"; // Add order by after populating with some checkboxes
    const values = [
        parseInt(req.params.id),
        parseInt(req.params.checkbox_id),
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

// @desc    Get the largest checkbox id
// @route   GET /:id/checkbox/largest_id
export const getLargestCheckboxId = async (req, res, next) => {
    const query =
        "SELECT coalesce((SELECT n_checkbox_id FROM checklist WHERE n_sec_id = $1), 0) AS n_checkbox_id";
    const values = [parseInt(req.params.id)];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

// @desc    See if checkbox id exists in table
// @route   GET /checklist/:id/checkbox/has_id/:checkbox_id
export const hasCheckboxId = async (req, res, next) => {
    const query =
        "SELECT coalesce((SELECT true FROM checklist WHERE n_sec_id = $1 and n_checkbox_id = $2 and user_id = $3), false) AS has_checkbox_id";

    const values = [
        parseInt(req.params.id),
        parseInt(req.params.checkbox_id),
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

// @desc    Create a new checklist given a checklist id
// POST     /checklist/:id
export const createChecklist = async (req, res, next) => {
    const query = "INSERT INTO checklist (n_sec_id, user_id) VALUES ($1, $2)";
    const values = [parseInt(req.params.id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

// @desc    Create a new checkbox given a checklist id and checkbox id
// POST     POST /checklist/:id/checkbox/:checkbox_id
export const createCheckbox = async (req, res, next) => {
    const query =
        "INSERT INTO checklist (n_sec_id, n_checkbox_id, user_id) VALUES ($1, $2, $3)";
    const values = [
        parseInt(req.params.id),
        parseInt(req.params.checkbox_id),
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

// @desc    Update checkbox text given a checklist id and checkbox id
// @route   UPDATE /checklist/:id/checkbox/:checkbox_id
export const updateText = async (req, res, next) => {
    const query =
        "UPDATE checklist SET v_text = $1 WHERE n_sec_id = $2 and n_checkbox_id = $3 and user_id = $4";
    const values = [
        req.body.text,
        parseInt(req.params.id),
        parseInt(req.params.checkbox_id),
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

// @desc    Update a checkbox given a checklist id, checkbox id and boolean
// @route   UPDATE /checklist/:id/checkbox/:checkbox_id/check/:checked
export const updateCheck = async (req, res, next) => {
    const query =
        "UPDATE checklist SET is_checked = $1 WHERE n_sec_id = $2 and n_checkbox_id = $3 and user_id = $4";
    const values = [
        req.params.checked === "true",
        parseInt(req.params.id),
        parseInt(req.params.checkbox_id),
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

// @desc    Delete a checklist given a checklist id
// @route   DELETE /checklist/:id
export const deleteChecklist = async (req, res, next) => {
    const query = `DELETE FROM checklist WHERE n_sec_id = $1 and user_id = $2`;
    const values = [parseInt(req.params.id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

// @desc    Delete a checkbox given a checklist id and checkbox id
// @route   DELETE /checklist/:id/checkbox/:checkbox_id
export const deleteCheckboxId = async (req, res, next) => {
    const query = `DELETE FROM checklist WHERE n_sec_id = $1 and n_checkbox_id = $2 and user_id = $3`;
    const values = [
        parseInt(req.params.id),
        parseInt(req.params.checkbox_id),
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

// @desc    Delete all empty checkboxes given a checklist id
// @route   DELETE /checklist/:id/delete_empty_checkbox
export const deleteEmptyCheckbox = async (req, res, next) => {
    const query = `DELETE FROM checklist WHERE n_sec_id = $1 and user_id = $2 and (v_text = '' OR v_text is NULL)`;
    const values = [parseInt(req.params.id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};
