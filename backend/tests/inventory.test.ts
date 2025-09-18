import request from "supertest";
import app from "../src/app";
import User from "../src/models/User";
import Sweet from "../src/models/Sweet";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

let token: string;
let adminToken: string;
let sweetId: string;

beforeAll(async () => {
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await User.create({
    name: "Alice",
    email: "alice@example.com",
    passwordHash,
    role: "customer",
  });

  token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  const admin = await User.create({
    name: "Admin",
    email: "admin@example.com",
    passwordHash,
    role: "admin",
  });

  adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
});

beforeEach(async () => {
  const sweet = await Sweet.create({
    name: "Ladoo",
    category: "Traditional",
    price: 100,
    quantity: 10,
  });
  sweetId = sweet.id;
});

afterEach(async () => {
  await Sweet.deleteMany({});
});

describe("Inventory API", () => {
  it("should allow a customer to purchase a sweet (decrease quantity)", async () => {
    const res = await request(app)
      .post(`/api/inventory/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 2 })
      .expect(200);

    expect(res.body.quantity).toBe(8);
  });

  it("should not allow purchase if insufficient stock", async () => {
    const res = await request(app)
      .post(`/api/inventory/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 20 })
      .expect(400);

    expect(res.body.msg).toBe("Not enough stock available");
  });

  it("should allow admin to restock a sweet (increase quantity)", async () => {
    const res = await request(app)
      .post(`/api/inventory/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 5 })
      .expect(200);

    expect(res.body.quantity).toBe(15);
  });
});
