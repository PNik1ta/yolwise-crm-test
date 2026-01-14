import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.guard";
import { usersService } from "./users.service";

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
