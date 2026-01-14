import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const authRateLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
	skip: (req) =>
		process.env.NODE_ENV === "test" &&
		req.headers["x-enable-rate-limit-test"] !== "1",
	keyGenerator: (req) => {
		const rawIp = req.ip ?? "";
		const normalizedIp = ipKeyGenerator(rawIp);

		return `${normalizedIp}:${req.path}`;
	},
	message: {
		message: "Too many attempts, please try again later",
	},
});
