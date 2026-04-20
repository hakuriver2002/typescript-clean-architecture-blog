import { Router } from "express";
import { authController } from "../controllers/AuthController";
import { validate } from "../middlewares/validate";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authGeneralLimiter, authLoginLimiter } from "../middlewares/authRateLimit";
import { asyncHandler } from "../middlewares/asyncHandler";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validators/authValidators";

const authRouter = Router();

authRouter.post(
  "/register",
  authGeneralLimiter,
  validate(registerSchema),
  asyncHandler(authController.register.bind(authController))
);

authRouter.post(
  "/login",
  authLoginLimiter,
  validate(loginSchema),
  asyncHandler(authController.login.bind(authController))
);

authRouter.post(
  "/logout",
  authMiddleware,
  asyncHandler(authController.logout.bind(authController))
);
authRouter.get(
  "/me",
  authMiddleware,
  asyncHandler(authController.me.bind(authController))
);
authRouter.post(
  "/forgot-password",
  authGeneralLimiter,
  validate(forgotPasswordSchema),
  asyncHandler(authController.forgotPassword.bind(authController))
);
authRouter.post(
  "/reset-password",
  authGeneralLimiter,
  validate(resetPasswordSchema),
  asyncHandler(authController.resetPassword.bind(authController))
);
authRouter.post(
  "/refresh",
  authGeneralLimiter,
  asyncHandler(authController.refresh.bind(authController))
);

export { authRouter };