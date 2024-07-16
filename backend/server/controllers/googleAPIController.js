import { google } from "googleapis";
import { authenticate } from "@google-cloud/local-auth";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import pg from "pg";

// Imports the Google Cloud client library
import { PubSub } from "@google-cloud/pubsub";
import { Storage } from "@google-cloud/storage";

const pool = new pg.Pool({
    user: process.env.POSTGRES_DB_USER,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_DB_PASS,
    port: process.env.POSTGRES_DB_PORT,
});

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const SCOPES = [
    "https://www.googleapis.com/auth/forms.body.readonly",
    "https://www.googleapis.com/auth/forms.responses.readonly",
];
const TOKEN_PATH = path.join(__dirname, "../utils/token.json");
const CREDENTIALS_PATH = path.join(__dirname, "../utils/credentials.json");

const loadSaveCredentialsIfExist = async () => {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (error) {
        return null;
    }
};

const saveCredentials = async (client) => {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: "authorized_user",
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
};

export const authorize = async () => {
    let client = await loadSaveCredentialsIfExist();

    if (client) {
        return client;
    }

    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });

    if (client.credentials) {
        await saveCredentials(client);
    }

    return client;
};

const formContents = async (auth, id) => {
    const form = google.forms({
        version: "v1",
        auth: auth,
    });

    const res = await form.forms.get({
        formId: id,
    });

    return res;
};

const formResponses = async (auth, id) => {
    const form = google.forms({
        version: "v1",
        auth: auth,
    });

    const res = await form.forms.responses.list({
        formId: id,
    });

    return res;
};

const formQuestions = async (auth, id) => {
    const form = google.forms({
        version: "v1",
        auth: auth,
    });

    const res = await form.forms.get({
        formId: id,
    });

    return res;
};

export const getAllFormContents = (req, res) => {
    authorize()
        .then((auth) => formContents(auth, req.params.file_id))
        .then((result) => {
            res.status(200).send(result.data);
        })
        .catch(console.error);
};

export const getAllFormResponses = (req, res) => {
    authorize()
        .then((auth) => formResponses(auth, req.params.file_id))
        .then((result) => {
            res.status(200).send(result.data);
        })
        .catch(console.error);
};

export const getAllFormQuestions = (req, res) => {
    authorize()
        .then((auth) => formQuestions(auth, req.params.file_id))
        .then((result) => {
            const filtered = result.data.items
                .filter((item) => Boolean(item.questionItem))
                .map((item) => ({
                    title: item.title,
                    questionId: item.questionItem.question.questionId,
                }));

            req.io.on("connection", (socket) => {
                socket.emit("questions", filtered);
            });

            res.status(200).send(filtered);
        })
        .catch(console.error);
};

export const getFormQuestionResponses = (req, res) => {
    authorize()
        .then((auth) => {
            return Promise.all([
                formContents(auth, req.params.file_id),
                formResponses(auth, req.params.file_id),
            ]);
        })
        .then((result) => {
            let data = null;

            if (req.params.respondent_type !== "none") {
                if (req.params.respondent_type === "email") {
                    data = result[1].data.responses
                        .filter((item) =>
                            Boolean(item.answers[req.params.question_id]),
                        )
                        .map((item) => ({
                            respondent: item.respondentEmail,
                            answers:
                                item.answers[req.params.question_id].textAnswers
                                    .answers[0],
                        }));
                } else {
                    const question_id = result[0].data.items.find(
                        (item) => item.title === req.params.respondent_type,
                    ).questionItem.question.questionId;

                    data = result[1].data.responses
                        .filter((item) =>
                            Boolean(item.answers[req.params.question_id]),
                        )
                        .map((item) => ({
                            respondent:
                                item.answers[question_id].textAnswers.answers[0]
                                    .value,
                            answers:
                                item.answers[req.params.question_id].textAnswers
                                    .answers[0],
                        }));
                }
            } else {
                data = result[1].data.responses
                    .filter((item) =>
                        Boolean(item.answers[req.params.question_id]),
                    )
                    .map((item) => ({
                        respondent: null,
                        answers:
                            item.answers[req.params.question_id].textAnswers
                                .answers[0],
                    }));
            }

            res.status(200).send(data);
        })
        .catch(console.error);
};

export const getDataWithSectionId = async (req, res) => {
    const query = "SELECT * FROM google WHERE section_id = $1 and user_id = $2";
    const values = [parseInt(req.params.section_id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const getDataWithGoogleId = async (req, res) => {
    const query = "SELECT * FROM google WHERE file_id = $1 and user_id = $2";
    const values = [req.params.file_id, req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const createWithData = async (req, res) => {
    const query =
        "INSERT INTO google (section_id, file_id, file_type, user_id) VALUES ($1, $2, $3, $4)";
    const values = [
        parseInt(req.params.section_id),
        req.params.file_id,
        req.params.file_type,
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const createNewData = async (req, res) => {
    const query = "INSERT INTO google (section_id, user_id) VALUES ($1, $2)";
    const values = [parseInt(req.params.section_id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const updateDataDisplay = async (req, res) => {
    const query =
        "UPDATE google SET display_type = $1 WHERE section_id = $2 and user_id = $3";
    const values = [
        req.params.display_type,
        parseInt(req.params.section_id),
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const updateDataQuestion = async (req, res) => {
    const query =
        "UPDATE google SET question_id = $1, title = $2 WHERE section_id = $3 and user_id = $4";
    const values = [
        req.params.question_id,
        req.params.title,
        parseInt(req.params.section_id),
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const updateGoogleFile = async (req, res) => {
    const query =
        "UPDATE google SET file_id = $1, file_type = $2 WHERE section_id = $3 and user_id = $4";
    const values = [
        req.params.file_id,
        req.params.file_type,
        parseInt(req.params.section_id),
        req.params.user_id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};

export const deleteData = async (req, res) => {
    const query = "DELETE FROM google WHERE section_id = $1 and user_id = $2";
    const values = [parseInt(req.params.section_id), req.params.user_id];

    const result = await pool.query(query, values);

    res.status(200).send(result.rows);
};
