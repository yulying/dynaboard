import jwt from "jsonwebtoken";

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        return res
            .status(401)
            .send({ message: "Unauthorized! Access Token was expired!" });
    }

    return res.status(401).send({ message: "Unauthorized!" });
};

export const verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!",
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return catchError(err, res);
        }

        if (req.params.user_id !== decoded.userId) {
            return res.status(401).send({ message: "Unauthorized!" });
        }

        next();
    });
};

export const testToken = (req, res, next) => {
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err instanceof TokenExpiredError)
                return res.status(401).send({ message: "Expired token" });
            else {
                return res
                    .status(401)
                    .send({ unauthorized: true, message: "Unauthorized!" });
            }
        }

        if (req.params.user_id !== decoded.userId) {
            return res
                .status(401)
                .send({ unauthorized: true, message: "Unauthorized!" });
        }

        return res.status(200).send({ message: "Access token valid" });
    });
};
