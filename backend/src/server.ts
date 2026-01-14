import { app } from "./app";
import { env } from "./config/env";

const port = env.port;

const server = app.listen(port, () => {
	console.log(`[server] Listening on port ${port}`);
});

process.on("SIGTERM", () => {
	console.log("[server] SIGTERM received, shutting down");
	server.close(() => {
		console.log("[server] Closed http server");
		process.exit(0);
	});
});
