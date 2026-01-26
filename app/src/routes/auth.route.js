import { Router } from "express";
import * as authController from "../controllers/auth.controllers.js";

const router = Router();

router.post("auth/login", authController.loginController);
router.post("auth/refresh", authController.refATController);
router.post("auth/logout", authController.logoutController);

export default router;