import pg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const pool = new pg.Pool({
    user: process.env.POSTGRES_DB_USER,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_DB_PASS,
    port: process.env.POSTGRES_DB_PORT,
});

const createToken = async (userId) => {
    const expiredAt =
        Date.now() / 1000.0 + parseInt(process.env.JWT_REFRESH_EXPIRATION_TS);
    const _token = crypto.randomUUID();

    const query =
        "INSERT INTO login (user_id, refresh_token, expiry_date) VALUES ($1, $2, to_timestamp($3))";
    const values = [userId, _token, expiredAt];

    await pool.query(query, values);

    return _token;
};

const verifyExpiration = (expiry) => {
    return parseInt(expiry) < Date.now() / 1000.0;
};

export const saveUserCredentials = async (req, res) => {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    console.log(username);

    const findUserQuery =
        "SELECT (EXISTS (SELECT username FROM users WHERE username = $1))::int";
    const findUserValues = [username];

    const userExists = await pool.query(findUserQuery, findUserValues);

    if (userExists.rows[0].exists) {
        res.status(400).send({
            message: "Username already exists.",
        });
        return;
    }

    const findEmailQuery =
        "SELECT (EXISTS (SELECT user_email FROM users WHERE user_email = $1))::int";
    const findEmailValues = [email];

    const emailExists = await pool.query(findEmailQuery, findEmailValues);

    if (emailExists.rows[0].exists) {
        res.status(400).send({
            message: "Email already in use.",
        });
        return;
    }

    const date = Date.now();

    const createUserQuery = `INSERT INTO users (user_id, username, user_email, user_password, date_created, last_updated) VALUES ($1, $2, $3, $4, to_timestamp($5 / 1000.0), to_timestamp($6 / 1000.0))`;
    const createUserValues = [
        crypto.randomUUID(),
        username,
        email,
        hash,
        date,
        date,
    ];

    const createUserResult = await pool.query(
        createUserQuery,
        createUserValues,
    );

    res.status(200).json(createUserResult.rows);
};

export const loginUserCredentials = async (req, res) => {
    const { username, password } = req.body;

    const query = "SELECT * FROM users WHERE username = $1";
    const values = [username];

    const result = await pool.query(query, values);

    if (result.rowCount == 0) {
        res.status(401).send({
            accessToken: null,
            message: "No matching username and/or password found.",
        });
        return;
    }

    const isValid = await bcrypt.compare(
        password,
        result.rows[0].user_password,
    );

    if (!isValid) {
        res.status(401).send({
            accessToken: null,
            message: "No matching username and/or password found.",
        });
        return;
    }

    const token = jwt.sign(
        { userId: result.rows[0].user_id },
        process.env.JWT_SECRET,
        {
            algorithm: "HS256",
            allowInsecureKeySizes: true,
            expiresIn: process.env.JWT_EXPIRATION,
        },
    );

    const refreshToken = await createToken(result.rows[0].user_id);

    res.status(200).send({
        userId: result.rows[0].user_id,
        accessToken: token,
        refreshToken: refreshToken,
    });
};

export const logoutUser = async (req, res) => {
    const { userId } = req.body;

    const destroyTokenQuery = "DELETE FROM login WHERE user_id = $1";
    const destroyTokenValues = [userId];

    await pool.query(destroyTokenQuery, destroyTokenValues);

    res.status(200).send({
        logout: true,
    });
};

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (refreshToken === null || refreshToken === undefined) {
        return res.status(403).json({ message: "Refresh token is required!" });
    }

    try {
        const getTokenUserQuery =
            "SELECT user_id, refresh_token, extract(epoch from expiry_date) as expiry_date FROM login WHERE refresh_token = $1";
        const getTokenUserValues = [refreshToken];

        const tokenUser = await pool.query(
            getTokenUserQuery,
            getTokenUserValues,
        );

        if (!tokenUser.rows[0]) {
            console.log("Invalid token");
            res.status(403).json({ message: "Invalid refresh token" });
            return;
        }

        if (verifyExpiration(tokenUser.rows[0].expiry_date)) {
            const destroyTokenQuery = "DELETE FROM login WHERE user_id = $1";
            const destroyTokenValues = [tokenUser.rows[0].user_id];

            await pool.query(destroyTokenQuery, destroyTokenValues);

            res.status(403).json({
                message:
                    "Refresh token was expired. Please make a new signin request.",
            });

            return;
        }

        const newAccessToken = jwt.sign(
            { userId: tokenUser.rows[0].user_id },
            process.env.JWT_SECRET,
            {
                algorithm: "HS256",
                allowInsecureKeySizes: true,
                expiresIn: process.env.JWT_EXPIRATION,
            },
        );

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: tokenUser.rows[0].refresh_token,
        });
    } catch (err) {
        return res.status(500).send({ message: "Internal Server Error" });
    }
};
