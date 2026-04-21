import { z } from "zod";

export const articleIdParamsSchema = {
  params: z.object({
    articleId: z.string().uuid(),
  }),
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(50).default(10),
  }),
};

export const createCommentSchema = {
  params: z.object({
    articleId: z.string().uuid(),
  }),
  body: z.object({
    content: z.string().trim().min(1).max(2000),
    parentId: z.string().uuid().optional(),
  }),
};

export const deleteCommentSchema = {
  params: z.object({
    articleId: z.string().uuid(),
    commentId: z.string().uuid(),
  }),
};

export const replyCommentSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    content: z.string().trim().min(1).max(2000),
  }),
};
