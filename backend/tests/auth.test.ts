import request from "supertest";
import app from "../src/app";
import User from "../src/models/User";
import mongoose from "mongoose";

describe("Auth API", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Alice",
        email: "alice@example.com",
        password: "password123"
      })
      .expect(200);

    expect(res.body.msg).toBe("User registered successfully");
  });

  it("should not allow duplicate email registration", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Alice",
      email: "alice@example.com",
      password: "password123"
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Alice",
      email: "alice@example.com",
      password: "password123"
    });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("User already exists");
  });

  it("should login with valid credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Alice",
      email: "alice@example.com",
      password: "password123"
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "alice@example.com",
        password: "password123"
      })
      .expect(200);

    expect(res.body.token).toBeDefined();
  });

  it("should not login with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Alice",
      email: "alice@example.com",
      password: "password123"
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "alice@example.com",
        password: "wrongpassword"
      });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Invalid credentials");
  });
});
