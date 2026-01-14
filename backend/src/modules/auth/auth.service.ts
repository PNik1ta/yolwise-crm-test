import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { prisma } from "../../config/prisma";
import { AppError, assertRequiredFields, isEmailValid, isPasswordStrong } from "../../utils";
import type { LoginDto, RegisterDto } from "./auth.types";

const SALT_ROUNDS = 10;

export class AuthService {
	async register(dto: RegisterDto) {
		assertRequiredFields(dto, ["email", "password", "fullName"]);

		if (!isEmailValid(dto.email)) {
			throw new AppError(400, "Email is invalid");
		}

		if (!isPasswordStrong(dto.password)) {
			throw new AppError(400, "Password must contains min 4 symbols, 1 capitalize letter, 1 digit and 1 special symbol");
		}

		const existing = await prisma.user.findUnique({
			where: { email: dto.email },
		});

		if (existing) {
			throw new AppError(400, "User with this email already exists");
		}

		const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

		const user = await prisma.user.create({
			data: {
				email: dto.email,
				passwordHash,
				fullName: dto.fullName,
			},
			select: {
				id: true,
				email: true,
				fullName: true,
				createdAt: true,
			},
		});

		return user;
	}

	async login(dto: LoginDto) {
		assertRequiredFields(dto, ["email", "password"]);

		if (!isEmailValid(dto.email)) {
			throw new AppError(400, "Email is invalid");
		}

		const user = await prisma.user.findUnique({
			where: { email: dto.email },
		});

		if (!user) {
			throw new AppError(400, "Invalid email or password");
		}

		const isValid = await bcrypt.compare(dto.password, user.passwordHash);

		if (!isValid) {
			throw new AppError(400, "Invalid email or password");
		}

		const token = jwt.sign({ userId: user.id }, env.jwtSecret, {
			expiresIn: env.jwtExpiresIn,
		} as SignOptions);

		const safeUser = {
			id: user.id,
			email: user.email,
			fullName: user.fullName,
			createdAt: user.createdAt,
		};

		return { token, user: safeUser };
	}
}

export const authService = new AuthService();
