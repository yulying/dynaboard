import jwt from "jsonwebtoken";

const SECRET_KEY = "YOUR_SECRET_KEY"; // Store this securely!

export const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
        expiresIn: "1h",
    });
};

export const verifyToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
};
