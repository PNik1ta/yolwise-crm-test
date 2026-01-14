import { Router } from "express";
import { authRateLimiter } from "../../middlewares/rate-limit";
import { authController } from "./auth.controller";

const router = Router();

router.post("/register", authRateLimiter, (req, res, next) =>
	authController.register(req, res, next),
);

router.post("/login", authRateLimiter, (req, res, next) => authController.login(req, res, next));

router.post("/logout", (req, res, next) => authController.logout(req, res, next));

export { router as authRouter };
