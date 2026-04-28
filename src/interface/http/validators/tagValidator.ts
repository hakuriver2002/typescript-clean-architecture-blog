import { z } from "zod";

export const getAllTagsSchema = {
    query: z.object({
        search: z.string().optional(),
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(100).default(10),
    }),
};

export const getTagByIdSchema = {
    params: z.object({
        id: z.string().uuid(),
    }),
};

export const getTagBySlugSchema = {
    params: z.object({
        slug: z.string().min(2).max(50),
    }),
};

export const getTagByNameSchema = {
    params: z.object({
        name: z.string().min(2).max(50),
    }),
};

export const createTagSchema = {
    body: z.object({
        name: z.string().min(2).max(50),
    }),
};

export const updateTagSchema = {
    body: z.object({
        name: z.string().min(2).max(50).optional(),
    }).refine((body) => Object.keys(body).length > 0, {
        message: "At least one field is required",
    }),
};

export const deleteTagSchema = {
    params: z.object({
        id: z.string().uuid(),
    }),
};
