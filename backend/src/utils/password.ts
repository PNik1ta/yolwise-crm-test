export function isPasswordStrong(password: string): boolean {
	const hasMinLength = password.length >= 8;
	const hasDigit = /\d/.test(password);
	const hasSpecial = /[^A-Za-z0-9]/.test(password);

	return hasMinLength && hasDigit && hasSpecial;
}
