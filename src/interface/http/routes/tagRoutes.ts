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
    validate(getAllTagsSchema),
    asyncHandler(tagController.getAll.bind(tagController))
);

tagRouter.get(
    "/slug/:slug",
    validate(getTagBySlugSchema),
    asyncHandler(tagController.getBySlug.bind(tagController))
);

tagRouter.use(authMiddleware);

tagRouter.get(
    "/:id",
    validate(getTagByIdSchema),
    requirePermission("manage_tags"),
    asyncHandler(tagController.getById.bind(tagController))
);

tagRouter.get(
    "/name/:name",
    validate(getTagByNameSchema),
    requirePermission("manage_tags"),
    asyncHandler(tagController.getByName.bind(tagController))
);

tagRouter.post(
    "/",
    validate(createTagSchema),
    requirePermission("manage_tags"),
    asyncHandler(tagController.create.bind(tagController))
);

tagRouter.put(
    "/:id",
    validate(updateTagSchema),
    requirePermission("manage_tags"),
    asyncHandler(tagController.update.bind(tagController))
);

tagRouter.delete(
    "/:id",
    validate(deleteTagSchema),
    requirePermission("manage_tags"),
    asyncHandler(tagController.delete.bind(tagController))
);

export { tagRouter };
