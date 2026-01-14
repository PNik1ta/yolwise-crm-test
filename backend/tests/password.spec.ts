import { isPasswordStrong } from "../src/utils";

describe("isPasswordStrong", () => {
  it("returns true for strong password", () => {
    expect(isPasswordStrong("Qwerty1!")).toBe(true);
  });

  it("fails if password is too short", () => {
    expect(isPasswordStrong("Q1!")).toBe(false);
  });

  it("fails if no uppercase letter", () => {
    expect(isPasswordStrong("qwerty1!")).toBe(false);
  });

  it("fails if no digit", () => {
    expect(isPasswordStrong("Qwerty!!")).toBe(false);
  });

  it("fails if no special symbol", () => {
    expect(isPasswordStrong("Qwerty12")).toBe(false);
  });
});
