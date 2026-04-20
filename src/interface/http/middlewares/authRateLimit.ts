import rateLimit from "express-rate-limit";
import { env } from "../../../infrastructure/config/env";

const baseLimiterConfig = {
  windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
};

export const authGeneralLimiter = rateLimit({
  ...baseLimiterConfig,
  max: env.AUTH_RATE_LIMIT_MAX,
});

export const authLoginLimiter = rateLimit({
  ...baseLimiterConfig,
  max: env.LOGIN_RATE_LIMIT_MAX,
});