import express from "express";
import {
    saveUserCredentials,
    loginUserCredentials,
    logoutUser,
    refreshToken,
} from "../controllers/loginController.js";

const router = express.Router({ mergeParams: true });

router.post("/signup", saveUserCredentials);
router.post("/login", loginUserCredentials);
router.delete("/logout", logoutUser);

router.post("/refresh_token", refreshToken);

export default router;
