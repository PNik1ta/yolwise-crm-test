import { AppError } from "./app-error";

export function assertRequiredFields<T extends object>(dto: T, fields: (keyof T)[]) {
	for (const field of fields) {
		const value = dto[field];

		const isEmptyString = typeof value === "string" && value.trim().length === 0;

		if (value === undefined || value === null || isEmptyString) {
			throw new AppError(400, `${String(field)} is required`);
		}
	}
}

export function isEmailValid(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
