import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requirePermission } from "../middlewares/requirePermission";
import { validate } from "../middlewares/validate";
import { commentController } from "../controllers/CommentController";
import {
  articleIdParamsSchema,
  createCommentSchema,
  deleteCommentSchema,
  replyCommentSchema,
} from "../validators/commentValidators";

const commentRouter = Router({ mergeParams: true });

commentRouter.get(
  "/",
  validate(articleIdParamsSchema),
  asyncHandler(commentController.listByArticle.bind(commentController)),
);

commentRouter.post(
  "/",
  authMiddleware,
  requirePermission("comment"),
  validate(createCommentSchema),
  asyncHandler(commentController.create.bind(commentController)),
);

commentRouter.post(
  "/:id/reply",
  authMiddleware,
  requirePermission("comment"),
  validate(replyCommentSchema),
  asyncHandler(commentController.reply.bind(commentController)),
);

commentRouter.delete(
  "/:commentId",
  authMiddleware,
  requirePermission("comment"),
  validate(deleteCommentSchema),
  asyncHandler(commentController.delete.bind(commentController)),
);

export { commentRouter };
