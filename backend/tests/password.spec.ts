import { isPasswordStrong } from "../src/utils";

describe("isPasswordStrong", () => {
	it("returns true for strong password", () => {
		expect(isPasswordStrong("Qwerty123!")).toBe(true);
	});

	it("fails if password is too short", () => {
		expect(isPasswordStrong("Q1!")).toBe(false);
	});

	it("fails if no digit", () => {
		expect(isPasswordStrong("Qwertyyyyy!!")).toBe(false);
	});

	it("fails if no special symbol", () => {
		expect(isPasswordStrong("Qwerty121212")).toBe(false);
	});
});
