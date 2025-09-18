import request from "supertest";
import app from "../src/app";
import User from "../src/models/User";
import Sweet from "../src/models/Sweet";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

let token: string;
let adminToken: string;

beforeAll(async () => {
  // Create a customer user
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await User.create({
    name: "Alice",
    email: "alice@example.com",
    passwordHash,
    role: "customer"
  });

  token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  // Create an admin user
  const admin = await User.create({
    name: "Admin",
    email: "admin@example.com",
    passwordHash,
    role: "admin"
  });

  adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
});

afterEach(async () => {
  await Sweet.deleteMany({});
});

describe("Sweets API", () => {
  it("should allow admin to add a new sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Kaju Katli",
        category: "Traditional",
        price: 200,
        quantity: 10
      })
      .expect(200);

    expect(res.body.name).toBe("Kaju Katli");
  });

  it("should allow any logged in user to view sweets", async () => {
    await Sweet.create({ name: "Ladoo", category: "Traditional", price: 100, quantity: 20 });

    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toBe("Ladoo");
  });

  it("should allow searching sweets by name", async () => {
    await Sweet.create({ name: "Rasgulla", category: "Traditional", price: 150, quantity: 30 });

    const res = await request(app)
      .get("/api/sweets/search?name=Rasgulla")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body[0].name).toBe("Rasgulla");
  });

  it("should allow admin to update a sweet", async () => {
    const sweet = await Sweet.create({ name: "Barfi", category: "Traditional", price: 180, quantity: 15 });

    const res = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 220 })
      .expect(200);

    expect(res.body.price).toBe(220);
  });

  it("should allow admin to delete a sweet", async () => {
    const sweet = await Sweet.create({ name: "Jalebi", category: "Traditional", price: 80, quantity: 50 });

    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.msg).toBe("Sweet deleted");
  });
});
