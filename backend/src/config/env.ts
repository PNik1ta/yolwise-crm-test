import "dotenv/config";
import { SignOptions } from "jsonwebtoken";

const requiredEnv = ["DATABASE_URL", "JWT_SECRET", "PORT"] as const;

requiredEnv.forEach((name) => {
  if (!process.env[name]) {
    console.warn(`[env] ${name} is not set`);
  }
});

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET must be set");
}

const jwtExpiresInRaw = process.env.JWT_EXPIRES_IN ?? "1h";

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret,
  jwtExpiresIn: jwtExpiresInRaw as SignOptions["expiresIn"],
};
