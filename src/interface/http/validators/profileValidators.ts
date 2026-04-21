import { z } from "zod";

export const profilePaginationQuerySchema = {
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
};

export const updateMyProfileSchema = {
  body: z.object({
    fullName: z.string().trim().min(2).max(100).optional(),
    avatarUrl: z.string().url().nullable().optional(),
  }).refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required",
  }),
};

export const changeMyPasswordSchema = {
  body: z.object({
    currentPassword: z.string().min(8).max(100),
    newPassword: z.string().min(8).max(100),
  }).refine((body) => body.currentPassword !== body.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  }),
};
