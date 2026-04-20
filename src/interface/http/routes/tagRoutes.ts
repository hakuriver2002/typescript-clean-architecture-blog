import { Router } from "express";
import { tagController } from "../controllers/TagController";
import { getAllTagsSchema, getTagByIdSchema, createTagSchema, updateTagSchema, deleteTagSchema, getTagBySlugSchema, getTagByNameSchema } from "../validators/tagValidator";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requirePermission } from "../middlewares/requirePermission";

const tagRouter = Router();

tagRouter.get(
    "/",
    authMiddleware,
    requirePermission("manage_tags"),
    validate(getAllTagsSchema),
    asyncHandler(tagController.getAll.bind(tagController))
);

tagRouter.get(
    "/:id",
    authMiddleware,
    validate(getTagByIdSchema),
    requirePermission("manage_tags"),
    asyncHandler(tagController.getById.bind(tagController))
);

tagRouter.get(
    "/slug/:slug",
    authMiddleware,
    validate(getTagBySlugSchema),
    requirePermission("manage_tags"),
    asyncHandler(tagController.getBySlug.bind(tagController))
);

tagRouter.get(
    "/name/:name",
    authMiddleware,
    validate(getTagByNameSchema),
    requirePermission("manage_tags"),
    asyncHandler(tagController.getByName.bind(tagController))
);

tagRouter.post(
    "/",
    authMiddleware,
    validate(createTagSchema),
    requirePermission("manage_tags"),
    asyncHandler(tagController.create.bind(tagController))
);

tagRouter.put(
    "/:id",
    authMiddleware,
    validate(updateTagSchema),
    requirePermission("manage_tags"),
    asyncHandler(tagController.update.bind(tagController))
);

tagRouter.delete(
    "/:id",
    authMiddleware,
    validate(deleteTagSchema),
    requirePermission("manage_tags"),
    asyncHandler(tagController.delete.bind(tagController))
);

export { tagRouter };
