import { Request, Response } from "express";
import { container } from "../../../infrastructure/container";
import { env } from "../../../infrastructure/config/env";
import { AppError } from "../../../shared/AppError";

const cookieBase = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export class AuthController {
  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie("access_token", accessToken, {
      ...cookieBase,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      ...cookieBase,
      maxAge: env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    });
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie("access_token", cookieBase);
    res.clearCookie("refresh_token", cookieBase);
  }

  async register(req: Request, res: Response) {
    const user = await container.registerUseCase.execute(req.body);
    return res.status(201).json({
      user,
      message: "Registration successful. Account is pending admin approval.",
    });
  }

  async login(req: Request, res: Response) {
    const user = await container.loginUseCase.execute(req.body);
    let redirectUrl = "/";
    if (user.role === "ADMIN") {
      redirectUrl = "/admin";
    }
    const session = await container.createSessionUseCase.execute(user.id);
    this.setAuthCookies(res, session.accessToken, session.refreshToken);
    return res.status(200).json({
      user,
      message: "Login successful",
      redirectUrl,
    });
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies?.refresh_token as string | undefined;
    if (!refreshToken) throw new AppError("Refresh token missing", 401);

    const session = await container.refreshSessionUseCase.execute(refreshToken);
    this.setAuthCookies(res, session.accessToken, session.refreshToken);
    return res.status(200).json({ message: "Session refreshed" });
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies?.refresh_token as string | undefined;
    await container.logoutUseCase.execute(refreshToken);
    this.clearAuthCookies(res);
    return res.status(200).json({ message: "Logged out" });
  }

  async me(req: Request, res: Response) {
    const result = await container.getMeUseCase.execute(req.user!.id);
    return res.status(200).json(result);
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    await container.forgotPasswordUseCase.execute(email);
    return res.status(200).json({
      message: "If the email exists, a reset link has been sent.",
    });
  }

  async resetPassword(req: Request, res: Response) {
    await container.resetPasswordUseCase.execute(req.body);
    return res.status(200).json({ message: "Password reset successful" });
  }
}

export const authController = new AuthController();