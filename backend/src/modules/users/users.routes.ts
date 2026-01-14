import { Router } from "express";
import { usersController } from "./users.controller";
import { authGuard } from "../../middlewares/auth.guard";

const router = Router();

router.get("/", authGuard, (req, res, next) =>
  usersController.list(req, res, next),
);

export { router as usersRouter };
