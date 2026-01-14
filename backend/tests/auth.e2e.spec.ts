import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/config/prisma";

describe("Auth flows", () => {
	beforeAll(async () => {
		await prisma.$connect();
	});

	beforeEach(async () => {
		await prisma.user.deleteMany();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	it("registers user successfully", async () => {
		const res = await request(app).post("/api/auth/register").send({
			email: "test@example.com",
			password: "Qwerty123!",
			fullName: "Test User",
		});

		expect(res.status).toBe(201);
		expect(res.body).toMatchObject({
			email: "test@example.com",
			fullName: "Test User",
		});
		expect(res.body).not.toHaveProperty("passwordHash");
		expect(res.headers["set-cookie"]).toBeDefined(); // 🔥 теперь и это
	});

	it("rejects duplicate email on register", async () => {
		await prisma.user.create({
			data: {
				email: "test@example.com",
				passwordHash: "hash",
				fullName: "Test User",
			},
		});

		const res = await request(app).post("/api/auth/register").send({
			email: "test@example.com",
			password: "Qwerty123!",
			fullName: "Test User",
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBeDefined();
	});

	it("rejects weak password on register", async () => {
		const res = await request(app).post("/api/auth/register").send({
			email: "weak@example.com",
			password: "abc",
			fullName: "Weak User",
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBeDefined();
	});

	it("logs in and sets auth cookie", async () => {
		await request(app).post("/api/auth/register").send({
			email: "test@example.com",
			password: "Qwerty123!",
			fullName: "Test User",
		});

		const res = await request(app).post("/api/auth/login").send({
			email: "test@example.com",
			password: "Qwerty123!",
		});

		expect(res.status).toBe(200);
		expect(res.headers["set-cookie"]).toBeDefined();
	});

	it("returns 400 for invalid login credentials", async () => {
		const res = await request(app).post("/api/auth/login").send({
			email: "nope@example.com",
			password: "Wrong123123!",
		});

		expect(res.status).toBe(400);
	});

	it("returns 400 if fullName is too short", async () => {
		const res = await request(app)
			.post("/api/auth/register")
			.send({
				email: "short-name@example.com",
				password: "Qwerty123!",
				fullName: "Abc",
			});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("message");
		expect(String(res.body.message)).toMatch(/full name/i);
	});

	it("denies access to /api/users without auth", async () => {
		const res = await request(app).get("/api/users");

		expect(res.status).toBe(401);
	});

	it("returns users list when authorized", async () => {
		const registerRes = await request(app).post("/api/auth/register").send({
			email: "users-list-test@example.com", // можно отдельный email, чтобы точно не пересечься
			password: "Qwerty123!",
			fullName: "Test User",
		});

		expect(registerRes.status).toBe(201);

		const loginRes = await request(app).post("/api/auth/login").send({
			email: "users-list-test@example.com",
			password: "Qwerty123!",
		});

		expect(loginRes.status).toBe(200);

		const cookie = loginRes.headers["set-cookie"];
		expect(cookie).toBeDefined();

		const res = await request(app).get("/api/users").set("Cookie", cookie);

		expect(res.status).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body[0]).toMatchObject({
			email: "users-list-test@example.com",
		});
	});


	it("applies rate limit to login", async () => {
		await request(app).post("/api/auth/register").send({
			email: "test@example.com",
			password: "Qwerty123!",
			fullName: "Test User",
		});

		for (let i = 0; i < 5; i++) {
			await request(app)
				.post("/api/auth/login")
				.set("x-enable-rate-limit-test", "1")
				.send({
					email: "test@example.com",
					password: "Qwerty123!",
				});
		}

		const res = await request(app)
			.post("/api/auth/login")
			.set("x-enable-rate-limit-test", "1")
			.send({
				email: "test@example.com",
				password: "Qwerty123!",
			});

		expect(res.status).toBe(429);
	});

});
