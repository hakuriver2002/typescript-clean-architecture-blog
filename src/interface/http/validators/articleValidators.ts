import { z } from "zod";
import { ArticleCategory } from "../../../domain/enums/article";

function richTextHasMinTextLength(value: string, minLength: number) {
  const textOnly = value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return textOnly.length >= minLength;
}

export const paginationQuerySchema = {
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(50).default(10),
  }),
};

export const createArticleSchema = {
  body: z.object({
    title: z.string().min(3).max(200),
    content: z
      .string()
      .refine((value) => richTextHasMinTextLength(value, 10), "Content must be at least 10 characters"),
    excerpt: z.string().max(300).optional(),
    thumbnailUrl: z.string().url().optional(),
    published: z.boolean().optional(),
    tagIds: z.array(z.string()).optional(),
  }),
};

export const updateArticleSchema = {
  params: z.object({ id: z.string().uuid() }),
  body: z
    .object({
      title: z.string().min(3).max(200).optional(),
      slug: z
        .string()
        .min(3)
        .max(200)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
        .optional(),
      content: z
        .string()
        .refine((value) => richTextHasMinTextLength(value, 10), "Content must be at least 10 characters")
        .optional(),
      excerpt: z.string().max(300).nullable().optional(),
      coverImage: z.string().url().nullable().optional(),
      published: z.boolean().optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field is required",
    }),
};

export const submitArticleSchema = {
  params: z.object({ id: z.string().uuid() }),
};

export const deletePostSchema = {
  params: z.object({ id: z.string().uuid() }),
};

export const getBySlugSchema = {
  params: z.object({ slug: z.string().min(3).max(200) }),
};

export const getByIdSchema = {
  params: z.object({ id: z.string().uuid() }),
};

export const rejectArticleSchema = {
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    rejectionReason: z.string().min(1, "Rejection reason is required"),
  }),
}