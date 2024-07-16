import pg from "pg";

const pool = new pg.Pool({
    user: process.env.POSTGRES_DB_USER,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_DB_PASS,
    port: process.env.POSTGRES_DB_PORT,
});

export const getAll = async (req, res, next) => {
    const query =
        "SELECT * FROM sections WHERE user_id = $1 ORDER BY section_id";
    const values = [req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const getAllTypes = async (req, res, next) => {
    const query =
        "SELECT DISTINCT section_type FROM sections WHERE user_id = $1";
    const values = [req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const getLargestSectionId = async (req, res, next) => {
    const query = "SELECT MAX(section_id) FROM sections WHERE user_id = $1";
    const values = [req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const getSectionById = async (req, res, next) => {
    const query =
        "SELECT * FROM sections WHERE section_id = $1 and user_id = $2";
    const values = [parseInt(req.params.section_id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const getSectionByType = async (req, res, next) => {
    const query =
        "SELECT * FROM sections WHERE section_type = $1 and user_id = $2";
    const values = [req.params.section_type, req.params.user_id];

    await pool.query(query, values);

    res.status(200).send({ message: "Successfully updated section" });
};

export const createSection = async (req, res, next) => {
    const query =
        "INSERT INTO sections (section_id, section_type, user_id) VALUES($1, $2, $3) RETURNING section_id";
    const values = [
        parseInt(req.params.section_id),
        req.params.section_type,
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const updateSection = async (req, res, next) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const getPrevSectionQuery =
            "SELECT * FROM sections WHERE section_id = $1 and user_id = $2";
        const prevSectionValues = [
            parseInt(req.params.section_id),
            req.params.user_id,
        ];
        const prevSection = await client.query(
            getPrevSectionQuery,
            prevSectionValues,
        );

        // table name gotten from previous query. safe from user input??
        const deleteFromCompQuery = `DELETE FROM ${prevSection.rows[0].section_type.toLowerCase()} WHERE user_id = $1 and section_id = $2`;
        const deleteFromCompValues = [
            req.params.user_id,
            parseInt(req.params.section_id),
        ];
        await client.query(deleteFromCompQuery, deleteFromCompValues);

        const updateSectionQuery =
            "UPDATE sections SET section_type = $1 WHERE user_id = $2 andd section_id = $3";
        const updateSectionValues = [
            req.params.section_type,
            req.params.user_id,
            parseInt(req.params.section_id),
        ];

        await client.query(updateSectionQuery, updateSectionValues);
        await client.query("COMMIT");

        res.status(200).send({ message: "Successfully updated section" });
    } catch (error) {
        await client.query("ROLLBACK");
        return next(error);
    } finally {
        client.release();
    }
};

export const updateSectionLabel = async (req, res, next) => {
    const query =
        "UPDATE sections SET section_label = $1 WHERE section_id = $2 and user_id = $3";
    const values = [
        req.params.section_label,
        parseInt(req.params.section_id),
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const deleteSection = async (req, res, next) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const getSection =
            "SELECT * FROM sections WHERE user_id = $1 and section_id = $2";
        const values = [req.params.user_id, parseInt(req.params.section_id)];
        const section = await client.query(getSection, values);

        const deleteSectionTable = `DELETE FROM ${section.rows[0].section_type.toLowerCase()} WHERE user_id = $1 and section_id = $2`;
        await client.query(deleteSectionTable, values);

        const deleteSection = `DELETE FROM sections WHERE user_id = $1 and section_id = $2`;

        await client.query(deleteSection, values);
        await client.query("COMMIT");

        res.status(200).send({ message: "Successfully delete section" });
    } catch (error) {
        await client.query("ROLLBACK");
        return next(error);
    } finally {
        client.release();
    }
};
