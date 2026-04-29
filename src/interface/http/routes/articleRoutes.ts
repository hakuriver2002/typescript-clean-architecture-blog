import { Router } from "express";
import { articleController } from "../controllers/ArticleController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requirePermission } from "../middlewares/requirePermission";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../middlewares/asyncHandler";
import {
  createArticleSchema,
  deletePostSchema,
  articlesByCategorySchema,
  articlesByTagSchema,
  getByIdSchema,
  getBySlugSchema,
  relatedArticlesByIdSchema,
  relatedArticlesBySlugSchema,
  listPublicArticlesQuerySchema,
  paginationQuerySchema,
  updateArticleSchema,
  submitArticleSchema,
  rejectArticleSchema,
  toggleLikeSchema,
  toggleBookmarkSchema,
  increaseViewSchema,
  setFeaturedArticleSchema,
} from "../validators/articleValidators";
import { commentRouter } from "./commentRoutes";

const articleRouter = Router();
articleRouter.use("/:articleId/comments", commentRouter);

// Public articles
articleRouter.get(
  "/",
  validate(listPublicArticlesQuerySchema),
  asyncHandler(articleController.listPublic.bind(articleController))
);

articleRouter.get(
  "/featured",
  validate(paginationQuerySchema),
  asyncHandler(articleController.listFeatured.bind(articleController))
);

articleRouter.get(
  "/trending",
  validate(paginationQuerySchema),
  asyncHandler(articleController.listTrending.bind(articleController))
);

articleRouter.get(
  "/tag/:slug",
  validate(articlesByTagSchema),
  asyncHandler(articleController.listByTag.bind(articleController))
);

articleRouter.get(
  "/category/:category",
  validate(articlesByCategorySchema),
  asyncHandler(articleController.listByCategory.bind(articleController))
);

articleRouter.get(
  "/slug/:slug/related",
  validate(relatedArticlesBySlugSchema),
  asyncHandler(articleController.listRelatedBySlug.bind(articleController))
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
  "/:id/related",
  validate(relatedArticlesByIdSchema),
  asyncHandler(articleController.listRelatedById.bind(articleController))
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
  requirePermission("review_article"),
  asyncHandler(articleController.approve.bind(articleController))
);

articleRouter.patch(
  "/:id/reject",
  authMiddleware,
  requirePermission("review_article"),
  validate(rejectArticleSchema),
  asyncHandler(articleController.reject.bind(articleController))
);

articleRouter.post(
  "/:id/like",
  authMiddleware,
  requirePermission("like_bookmark"),
  validate(toggleLikeSchema),
  asyncHandler(articleController.toggleLike.bind(articleController))
);

articleRouter.post(
  "/:id/bookmark",
  authMiddleware,
  requirePermission("like_bookmark"),
  validate(toggleBookmarkSchema),
  asyncHandler(articleController.toggleBookmark.bind(articleController))
);

articleRouter.post(
  "/:id/view",
  validate(increaseViewSchema),
  asyncHandler(articleController.increaseView.bind(articleController))
);

articleRouter.patch(
  "/:id/featured",
  authMiddleware,
  requirePermission("review_article"),
  validate(setFeaturedArticleSchema),
  asyncHandler(articleController.setFeatured.bind(articleController))
);

export { articleRouter };
