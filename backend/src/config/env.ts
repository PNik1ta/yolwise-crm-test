import "dotenv/config";

const requiredEnv = ["DATABASE_URL", "JWT_SECRET", "PORT"] as const;

requiredEnv.forEach((name) => {
  if (!process.env[name]) {
    console.warn(`[env] ${name} is not set`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
};
