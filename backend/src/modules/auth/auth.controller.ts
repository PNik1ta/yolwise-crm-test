import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";

export class AuthController {
	async register(req: Request, res: Response, next: NextFunction) {
		try {
			const { user, token } = await authService.register(req.body);

			res
				.cookie("token", token, {
					httpOnly: true,
					sameSite: "lax",
				})
				.status(201)
				.json(user);
		} catch (err) {
			next(err);
		}
	}

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { token, user } = await authService.login(req.body);

			res
				.cookie("token", token, {
					httpOnly: true,
					sameSite: "lax",
				})
				.status(200)
				.json(user);
		} catch (err) {
			next(err);
		}
	}

	async logout(_req: Request, res: Response, next: NextFunction) {
		try {
			res.clearCookie("token").status(200).json({ message: "Logged out" });
		} catch (err) {
			next(err);
		}
	}
}

export const authController = new AuthController();
