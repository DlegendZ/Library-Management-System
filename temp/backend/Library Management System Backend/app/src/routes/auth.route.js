import { Router } from "express";
import * as authController from "../controllers/auth.controllers.js";

const router = Router();

router.post("/login", authController.loginController);
router.post("/refresh", authController.refATController);
router.post("/logout", authController.logoutController);

export default router;