export function isPasswordStrong(password: string): boolean {
	// Min 4 symbols + 1 capitalize + 1 digit + 1 special symbol
	const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{4,}$/;
	return regex.test(password);
}