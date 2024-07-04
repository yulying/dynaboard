import express from "express";
import {
    saveUserCredentials,
    loginUserCredentials,
    logoutUser,
    refreshToken,
} from "../controllers/loginController.js";
import { testToken } from "../middleware/authJwt.js";

const router = express.Router({ mergeParams: true });

router.get("/:user_id/token", testToken);
router.post("/signup", saveUserCredentials);
router.post("/login", loginUserCredentials);
router.delete("/logout", logoutUser);

router.post("/refresh", refreshToken);

export default router;
