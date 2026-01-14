import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthRequest extends Request {
	userId?: number;
}

export function authGuard(req: AuthRequest, res: Response, next: NextFunction) {
	try {
		const tokenFromCookie = (req as any).cookies?.token as string | undefined;
		const authHeader = req.headers.authorization;

		const bearerToken = authHeader?.startsWith("Bearer ")
			? authHeader.slice(7)
			: undefined;

		const token = tokenFromCookie ?? bearerToken;

		if (!token) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const payload = jwt.verify(token, env.jwtSecret) as { userId: number };

		req.userId = payload.userId;

		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
}
