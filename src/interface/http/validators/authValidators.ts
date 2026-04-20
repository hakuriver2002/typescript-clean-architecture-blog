import { z } from "zod";

export const registerSchema = {
  body: z.object({
    fullName: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(128),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
  }),
};

export const forgotPasswordSchema = {
  body: z.object({
    email: z.string().email(),
  }),
};

export const resetPasswordSchema = {
  body: z.object({
    token: z.string().min(16),
    newPassword: z.string().min(8).max(128),
  }),
};