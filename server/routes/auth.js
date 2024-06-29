import express from "express";
import {
    saveUserCredentials,
    loginUserCredentials,
    refreshToken,
} from "../controllers/loginController.js";

const router = express.Router({ mergeParams: true });

router.post("/signup", saveUserCredentials);
router.post("/login", loginUserCredentials);

router.post("/refresh_token", refreshToken);

export default router;
