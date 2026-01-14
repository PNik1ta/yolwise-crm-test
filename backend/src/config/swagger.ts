import type { OpenAPIV3 } from "openapi-types";
import { env } from "./env";

const swaggerDefinition: OpenAPIV3.Document = {
	openapi: "3.0.0",
	info: {
		title: "Yolwise CRM Test API",
		version: "1.0.0",
		description: "Simple CRM test API with auth (register/login) and users list.",
	},
	servers: [
		{
			url: `http://localhost:${env.port}`,
			description: "Local dev",
		},
	],
	components: {
		securitySchemes: {
			// мы поддерживаем и cookie, и Bearer
			cookieAuth: {
				type: "apiKey",
				in: "cookie",
				name: "token",
			},
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
		},
		schemas: {
			RegisterRequest: {
				type: "object",
				required: ["email", "password", "fullName"],
				properties: {
					email: { type: "string", format: "email" },
					password: { type: "string", minLength: 8 },
					fullName: { type: "string" },
				},
			},
			LoginRequest: {
				type: "object",
				required: ["email", "password"],
				properties: {
					email: { type: "string", format: "email" },
					password: { type: "string" },
				},
			},
			User: {
				type: "object",
				properties: {
					id: { type: "integer" },
					email: { type: "string", format: "email" },
					fullName: { type: "string", nullable: true },
					createdAt: { type: "string", format: "date-time" },
				},
			},
			ErrorResponse: {
				type: "object",
				properties: {
					message: { type: "string" },
				},
			},
		},
	},
	paths: {
		"/api/auth/register": {
			post: {
				summary: "Register new user",
				tags: ["Auth"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/RegisterRequest",
							},
						},
					},
				},
				responses: {
					"201": {
						description: "User created",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/User",
								},
							},
						},
					},
					"400": {
						description: "Validation error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ErrorResponse",
								},
							},
						},
					},
				},
			},
		},
		"/api/auth/login": {
			post: {
				summary: "Login user",
				tags: ["Auth"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/LoginRequest",
							},
						},
					},
				},
				responses: {
					"200": {
						description: "Login successful, auth cookie is set",
						headers: {
							"Set-Cookie": {
								description: "HttpOnly auth token cookie",
								schema: { type: "string" },
							},
						},
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/User",
								},
							},
						},
					},
					"400": {
						description: "Invalid credentials or validation error",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ErrorResponse",
								},
							},
						},
					},
				},
			},
		},
		"/api/auth/logout": {
			post: {
				summary: "Logout user",
				tags: ["Auth"],
				responses: {
					"204": {
						description: "Logged out",
					},
				},
			},
		},
		"/api/users": {
			get: {
				summary: "Get all users (protected)",
				tags: ["Users"],
				security: [{ cookieAuth: [] }, { bearerAuth: [] }],
				responses: {
					"200": {
						description: "List of users",
						content: {
							"application/json": {
								schema: {
									type: "array",
									items: { $ref: "#/components/schemas/User" },
								},
							},
						},
					},
					"401": {
						description: "Unauthorized",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/ErrorResponse",
								},
							},
						},
					},
				},
			},
		},
	},
};

export const swaggerSpec = swaggerDefinition;
