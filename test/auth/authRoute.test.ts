import request from "supertest";
import express from "express";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { authRoutes } from "../../src/routes/authRoutes";
import { AuthService } from "../../src/service/authService";

const app = express();
app.use(express.json());
app.use(authRoutes);

describe("POST /auth/login", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 200 and a token for a successful login", async () => {
    const mockLoginResponse = {
      token: "mock_token",
      user: { id: 1, name: "Test User", email: "test@example.com" },
    };
    vi.spyOn(AuthService.prototype, "login").mockResolvedValue(mockLoginResponse);

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toEqual(mockLoginResponse);
  });

  it("should return 400 if validation fails (e.g., missing password)", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com" });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body).toHaveProperty("error");
  });

  it("should return 401 for invalid credentials", async () => {
    vi.spyOn(AuthService.prototype, "login").mockRejectedValue(new Error("Invalid credentials"));

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "wrong@example.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      status: "error",
      message: "Invalid credentials",
    });
  });

  it("should return 401 for other server errors", async () => {
    vi.spyOn(AuthService.prototype, "login").mockRejectedValue(new Error("Something went wrong"));

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Something went wrong');
  });
});