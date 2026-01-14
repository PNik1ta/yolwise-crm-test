import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/auth.routes";
import { usersRouter } from "./modules/users/users.routes";
import { errorHandler } from "./middlewares/error-handler";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(cors({
	origin: "http://localhost:3000",
	credentials: true,
}),);
app.use(express.json());
app.use(cookieParser());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get("/health", (_req, res) => {
	res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.use(errorHandler);

export { app };
