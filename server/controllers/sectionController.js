import pg from 'pg'
import { createNotepad, deleteNotepad } from './notepadController.js'
import { create } from 'domain'

const pool = new pg.Pool({
    user: process.env.POSTGRES_DB_USER,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_DB_PASS,
    port: process.env.POSTGRES_DB_PORT
})

// @desc    Get all sections
// @route   GET /all
export const getAll = (req, res, next) => {
    const query = 'SELECT * FROM sections'

    pool.query(query, (error, results) => {
        if (error) {
            return next(error)
        }
        res.status(200).json(results.rows)
    })
}

// @desc    Get all active distinct types
// @route   GET /type
export const getAllTypes = (req, res, next) => {
    const query = 'SELECT DISTINCT v_sec_type FROM sections'
    pool.query(query, (error, results) => {
        if (error) {
            return next(error)
        }

        res.status(200).json(results.rows)
    })
}

// @desc    Get section given an id
// @route   GET /sections/id/:id
export const getSectionById = (req, res, next) => {
    const query = 'SELECT * FROM sections WHERE n_sec_id = $1'
    const values = [parseInt(req.params.id)]

    console.log(parseInt(req.params.id))

    pool.query(query, values, (error, results) => {
        if (error) {
            return next(error)
        }

        res.status(200).json(results.rows)
    })
}

// @desc    Get sections given section type
// @route   GET /sections/type/:type
export const getSectionByType = (req, res, next) => {
    const query = 'SELECT * FROM sections WHERE v_sec_type = $1'
    const values = [req.params.type]

    pool.query(query, values, (error, results) => {
        if (error) {
            return next(error)
        }

        res.status(200).json(results.rows)
    })
}

// @desc    Create new section
// POST     /sections/:id/type/:type
export const createSection = async (req, res, next) => {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        const insertSection =
            'INSERT INTO sections (n_sec_id, v_sec_type) VALUES($1, $2) RETURNING n_sec_id'
        await client.query(insertSection, [parseInt(req.params.id), req.params.type])

        switch (req.params.type) {
            case 'Notepad':
                await promisify(createNotepad)
                await client.query('COMMIT')
                break
            case 'Checklist':
                console.log('Posting Checklist')
                const insertChecklist = 'INSERT INTO checklist (n_sec_id) VALUES ($1)'
                const insertChecklistValues = [parseInt(req.params.id)]

                await client.query(insertChecklist, insertChecklistValues)
                await client.query('COMMIT')
                break
        }

        res.status(200).send(`Successfully added new section`)
    } catch (error) {
        await client.query('ROLLBACK')

        return next(error)
    } finally {
        client.release()
    }
}

// @desc    Update section
// @route   UPDATE /sections/:id/type/:type
export const updateSection = async (req, res, next) => {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        const getPrevSection = 'SELECT * FROM sections WHERE n_sec_id = $1'
        const prevSection = await client.query(getPrevSection, [parseInt(req.params.id)])

        // table name gotten from previous query. safe from user input??
        const deletePrevSection = `DELETE FROM ${prevSection.rows[0].v_sec_type.toLowerCase()} WHERE n_sec_id = $1`
        await client.query(deletePrevSection, [parseInt(req.params.id)])

        const updateSection = 'UPDATE sections SET v_sec_type = $1 WHERE n_sec_id = $2'
        await client.query(updateSection, [req.params.type, parseInt(req.params.id)])

        switch (req.params.type) {
            case 'Notepad':
                await promisify(createNotepad)
                await client.query('COMMIT')
                break
            case 'Checklist':
                const insertChecklist = 'INSERT INTO checklist (n_sec_id) VALUES ($1)'
                const insertChecklistValues = [parseInt(req.params.id)]

                await client.query(insertChecklist, insertChecklistValues)
                await client.query('COMMIT')
                break
        }

        res.status(200).send(`Successfully updated section`)
    } catch (error) {
        await client.query('ROLLBACK')

        return next(error)
    } finally {
        client.release()
    }
}

// @desc    Delete section
// @route   DELETE /sections/:id
export const deleteSection = async (req, res, next) => {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        const getSection = 'SELECT * FROM sections WHERE n_sec_id = $1'
        const section = await client.query(getSection, [parseInt(req.params.id)])

        const deleteSectionTable = `DELETE FROM ${section.rows[0].v_sec_type.toLowerCase()} WHERE n_sec_id = $1`
        await client.query(deleteSectionTable, [parseInt(req.params.id)])

        const deleteSection = `DELETE FROM sections WHERE n_sec_id = $1`
        await client.query(deleteSection, [parseInt(req.params.id)])

        await client.query('COMMIT')

        res.status(200).send(`Successfully updated section`)
    } catch (error) {
        await client.query('ROLLBACK')

        return next(error)
    } finally {
        client.release()
    }
}
