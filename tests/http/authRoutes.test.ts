import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createAuthMiddlewareMock,
  createAuthRateLimitMocks,
  withTestAuth,
} from "../helpers/httpAuthMocks";
import { createHttpTestApp } from "../helpers/httpTestApp";

const mockContainer = {
  registerUseCase: { execute: vi.fn() },
  loginUseCase: { execute: vi.fn() },
  createSessionUseCase: { execute: vi.fn() },
  refreshSessionUseCase: { execute: vi.fn() },
  logoutUseCase: { execute: vi.fn() },
  getMeUseCase: { execute: vi.fn() },
  forgotPasswordUseCase: { execute: vi.fn() },
  resetPasswordUseCase: { execute: vi.fn() },
};

vi.mock("../../src/infrastructure/container", () => ({
  container: mockContainer,
}));

vi.mock("../../src/interface/http/middlewares/authMiddleware", () => createAuthMiddlewareMock());

vi.mock("../../src/interface/http/middlewares/authRateLimit", () => createAuthRateLimitMocks());

async function createTestApp() {
  return createHttpTestApp(
    async () => (await import("../../src/interface/http/routes/authRoutes")).authRouter,
    "/api/v1/auth",
    { useCookieParser: true },
  );
}

describe("authRouter HTTP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST /api/v1/auth/register registers user", async () => {
    mockContainer.registerUseCase.execute.mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
      fullName: "User Name",
      role: "MEMBER",
      status: "PENDING",
    });

    const app = await createTestApp();
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "User Name",
        email: "user@example.com",
        password: "password123",
      });

    expect(response.status).toBe(201);
    expect(mockContainer.registerUseCase.execute).toHaveBeenCalledWith({
      fullName: "User Name",
      email: "user@example.com",
      password: "password123",
    });
    expect(response.body.message).toBe("Registration successful. Account is pending admin approval.");
  });

  it("POST /api/v1/auth/login logs in and sets auth cookies", async () => {
    mockContainer.loginUseCase.execute.mockResolvedValue({
      id: "admin-1",
      email: "admin@example.com",
      fullName: "Admin",
      role: "ADMIN",
      status: "ACTIVE",
    });
    mockContainer.createSessionUseCase.execute.mockResolvedValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    const app = await createTestApp();
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "admin@example.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(mockContainer.loginUseCase.execute).toHaveBeenCalledWith({
      email: "admin@example.com",
      password: "password123",
    });
    expect(mockContainer.createSessionUseCase.execute).toHaveBeenCalledWith("admin-1");
    expect(response.body.redirectUrl).toBe("/admin");
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["set-cookie"][0]).toContain("access_token=access-token");
    expect(response.headers["set-cookie"][1]).toContain("refresh_token=refresh-token");
  });

  it("POST /api/v1/auth/refresh refreshes session from cookie", async () => {
    mockContainer.refreshSessionUseCase.execute.mockResolvedValue({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });

    const app = await createTestApp();
    const response = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", ["refresh_token=old-refresh-token"]);

    expect(response.status).toBe(200);
    expect(mockContainer.refreshSessionUseCase.execute).toHaveBeenCalledWith("old-refresh-token");
    expect(response.body.message).toBe("Session refreshed");
    expect(response.headers["set-cookie"][0]).toContain("access_token=new-access-token");
  });

  it("POST /api/v1/auth/refresh rejects when refresh token is missing", async () => {
    const app = await createTestApp();
    const response = await request(app).post("/api/v1/auth/refresh");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Refresh token missing");
  });

  it("POST /api/v1/auth/logout clears cookies for authenticated user", async () => {
    mockContainer.logoutUseCase.execute.mockResolvedValue(undefined);

    const app = await createTestApp();
    const response = await withTestAuth(
      request(app)
        .post("/api/v1/auth/logout")
        .set("Cookie", ["refresh_token=refresh-token"]),
    );

    expect(response.status).toBe(200);
    expect(mockContainer.logoutUseCase.execute).toHaveBeenCalledWith("refresh-token");
    expect(response.body.message).toBe("Logged out");
    expect(response.headers["set-cookie"][0]).toContain("access_token=;");
    expect(response.headers["set-cookie"][1]).toContain("refresh_token=;");
  });

  it("GET /api/v1/auth/me returns current authenticated user", async () => {
    mockContainer.getMeUseCase.execute.mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
      fullName: "User Name",
      role: "MEMBER",
      status: "ACTIVE",
    });

    const app = await createTestApp();
    const response = await withTestAuth(request(app).get("/api/v1/auth/me"));

    expect(response.status).toBe(200);
    expect(mockContainer.getMeUseCase.execute).toHaveBeenCalledWith("user-1");
    expect(response.body.email).toBe("user@example.com");
  });

  it("POST /api/v1/auth/forgot-password triggers forgot password flow", async () => {
    mockContainer.forgotPasswordUseCase.execute.mockResolvedValue(undefined);

    const app = await createTestApp();
    const response = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "user@example.com" });

    expect(response.status).toBe(200);
    expect(mockContainer.forgotPasswordUseCase.execute).toHaveBeenCalledWith("user@example.com");
    expect(response.body.message).toBe("If the email exists, a reset link has been sent.");
  });

  it("POST /api/v1/auth/reset-password resets password", async () => {
    mockContainer.resetPasswordUseCase.execute.mockResolvedValue(undefined);

    const app = await createTestApp();
    const response = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({
        token: "1234567890abcdef",
        newPassword: "newpassword123",
      });

    expect(response.status).toBe(200);
    expect(mockContainer.resetPasswordUseCase.execute).toHaveBeenCalledWith({
      token: "1234567890abcdef",
      newPassword: "newpassword123",
    });
    expect(response.body.message).toBe("Password reset successful");
  });

  it("POST /api/v1/auth/login rejects invalid body", async () => {
    const app = await createTestApp();
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "not-an-email",
        password: "short",
      });

    expect(response.status).toBe(422);
    expect(response.body.message).toBe("Validation error");
  });
});
