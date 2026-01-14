import { config } from "dotenv";

if (!process.env.DATABASE_URL) {
	const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

	config({ path: envFile });
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
	throw new Error("JWT_SECRET must be set");
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error("DATABASE_URL must be set");
}

export const env = {
	nodeEnv: process.env.NODE_ENV ?? "development",
	port: Number(process.env.PORT ?? 4000),
	databaseUrl,
	jwtSecret: jwtSecret as string,
	jwtExpiresIn: (process.env.JWT_EXPIRES_IN ?? "1h") as string,
};
