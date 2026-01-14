import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: (req, _res) => `${req.ip}:${req.path}`,
	message: {
		message: "Too many attempts, please try again later",
	},
});
