import pg from "pg";
import { createNotepad, deleteNotepad } from "./notepadController.js";
import { create } from "domain";

const pool = new pg.Pool({
    user: process.env.POSTGRES_DB_USER,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_DB_PASS,
    port: process.env.POSTGRES_DB_PORT,
});

// @desc    Get all sections
// @route   GET /all
export const getAll = async (req, res, next) => {
    const query = "SELECT * FROM sections ORDER BY n_sec_id";

    const result = await pool.query(query);

    res.status(200).send(result.rows);
};

// @desc    Get all active distinct types
// @route   GET /type
export const getAllTypes = async (req, res, next) => {
    const query = "SELECT DISTINCT v_sec_type FROM sections";

    const result = await pool.query(query);

    res.status(200).send(result.rows);
};

// @desc    Get the largest id number
// @route   GET /largest_id
export const getLargestSectionId = async (req, res, next) => {
    const query = "SELECT MAX(n_sec_id) FROM sections";

    const result = await pool.query(query);

    // console.log(result)

    res.status(200).send(result.rows);
};

// @desc    Get section given an id
// @route   GET /sections/id/:id
export const getSectionById = async (req, res, next) => {
    const query = "SELECT * FROM sections WHERE n_sec_id = $1";
    const values = [parseInt(req.params.id)];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

// @desc    Get sections given section type
// @route   GET /sections/type/:type
export const getSectionByType = async (req, res, next) => {
    const query = "SELECT * FROM sections WHERE v_sec_type = $1";
    const values = [req.params.type];

    const result = await pool.query(query, values);

    res.status(200).send({ message: "Successfully updated section" });
};

// @desc    Create new section
// POST     /sections/:id/type/:type
export const createSection = async (req, res, next) => {
    const query =
        "INSERT INTO sections (n_sec_id, v_sec_type) VALUES($1, $2) RETURNING n_sec_id";
    const values = [parseInt(req.params.id), req.params.type];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

// @desc    Update section
// @route   UPDATE /sections/:id/type/:type
export const updateSection = async (req, res, next) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const getPrevSectionQuery =
            "SELECT * FROM sections WHERE n_sec_id = $1";
        const prevSectionValues = [parseInt(req.params.id)];
        const prevSection = await client.query(
            getPrevSectionQuery,
            prevSectionValues,
        );

        // table name gotten from previous query. safe from user input??
        const deleteFromCompQuery = `DELETE FROM ${prevSection.rows[0].v_sec_type.toLowerCase()} WHERE n_sec_id = $1`;
        const deleteFromCompValues = [parseInt(req.params.id)];
        await client.query(deleteFromCompQuery, deleteFromCompValues);

        const updateSectionQuery =
            "UPDATE sections SET v_sec_type = $1 WHERE n_sec_id = $2";
        const updateSectionValues = [req.params.type, parseInt(req.params.id)];
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

// @desc    Delete section
// @route   DELETE /sections/:id
export const deleteSection = async (req, res, next) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const getSection = "SELECT * FROM sections WHERE n_sec_id = $1";
        const values = [parseInt(req.params.id)];
        const section = await client.query(getSection, values);

        const deleteSectionTable = `DELETE FROM ${section.rows[0].v_sec_type.toLowerCase()} WHERE n_sec_id = $1`;
        await client.query(deleteSectionTable, values);

        const deleteSection = `DELETE FROM sections WHERE n_sec_id = $1`;
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
