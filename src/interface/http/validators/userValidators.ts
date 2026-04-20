import { z } from "zod";

const userStatusEnum = z.enum(["PENDING", "ACTIVE", "INACTIVE", "REJECTED"]);
const userRoleEnum = z.enum(["ADMIN", "EDITOR", "TRAINER", "MEMBER"]);

export const listUsersSchema = {
  query: z.object({
    status: userStatusEnum.optional(),
    role: userRoleEnum.optional(),
    search: z.string().min(1).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
  }),
};

export const updateUserStatusSchema = {
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    status: userStatusEnum,
  }),
};

export const updateUserRoleSchema = {
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    role: userRoleEnum,
  }),
};