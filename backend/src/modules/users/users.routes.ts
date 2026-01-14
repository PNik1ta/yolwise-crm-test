import { Router } from "express";
import { authGuard } from "../../middlewares/auth.guard";
import { usersController } from "./users.controller";

const router = Router();

router.get("/", authGuard, (req, res, next) => usersController.list(req, res, next));

export { router as usersRouter };
