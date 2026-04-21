import { Router } from "express";
import { articleController } from "../controllers/ArticleController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requirePermission } from "../middlewares/requirePermission";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../middlewares/asyncHandler";
import {
  createArticleSchema,
  deletePostSchema,
  getByIdSchema,
  getBySlugSchema,
  paginationQuerySchema,
  updateArticleSchema,
  submitArticleSchema,
  rejectArticleSchema,
} from "../validators/articleValidators";
import { commentRouter } from "./commentRoutes";

const articleRouter = Router();
articleRouter.use("/:articleId/comments", commentRouter);

// Public articles
articleRouter.get(
  "/",
  validate(paginationQuerySchema),
  asyncHandler(articleController.listPublic.bind(articleController))
);

articleRouter.get(
  "/me",
  authMiddleware,
  requirePermission("create_article"),
  validate(paginationQuerySchema),
  asyncHandler(articleController.listMine.bind(articleController))
);

articleRouter.get(
  "/:id",
  validate(getByIdSchema),
  asyncHandler(articleController.getById.bind(articleController))
);

articleRouter.get(
  "/slug/:slug",
  validate(getBySlugSchema),
  asyncHandler(articleController.getBySlug.bind(articleController))
);

// articleRouter.get(
//   "/:slug-:id.html",
//   validate(getBySlugSchema),
//   asyncHandler(articleController.getBySlugAndId.bind(articleController))
// );

articleRouter.post(
  "/",
  authMiddleware,
  requirePermission("create_article"),
  validate(createArticleSchema),
  asyncHandler(articleController.create.bind(articleController))
);

articleRouter.patch(
  "/:id",
  authMiddleware,
  requirePermission("create_article"),
  validate(updateArticleSchema),
  asyncHandler(articleController.update.bind(articleController))
);

articleRouter.patch(
  "/:id/submit",
  authMiddleware,
  requirePermission("create_article"),
  validate(submitArticleSchema),
  asyncHandler(articleController.submit.bind(articleController))
);

articleRouter.delete(
  "/:id",
  authMiddleware,
  requirePermission("create_article"),
  validate(deletePostSchema),
  asyncHandler(articleController.delete.bind(articleController))
);


articleRouter.patch(
  "/:id/approve",
  authMiddleware,
  requirePermission("create_article"),
  asyncHandler(articleController.approve.bind(articleController))
);

articleRouter.patch(
  "/:id/reject",
  authMiddleware,
  requirePermission("create_article"),
  validate(rejectArticleSchema),
  asyncHandler(articleController.reject.bind(articleController))
);

export { articleRouter };
