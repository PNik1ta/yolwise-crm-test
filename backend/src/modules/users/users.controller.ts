import type { Response, NextFunction } from "express";
import { usersService } from "./users.service";
import { AuthRequest } from "../../middlewares/auth.guard";

export class UsersController {
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await usersService.listUsers();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }
}

export const usersController = new UsersController();