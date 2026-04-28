import { Router } from "express";
import { profileController } from "../controllers/ProfileController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../middlewares/asyncHandler";
import {
  changeMyPasswordSchema,
  profilePaginationQuerySchema,
  updateMyProfileSchema,
} from "../validators/profileValidators";

const profileRouter = Router();

profileRouter.use(authMiddleware);

profileRouter.get(
  "/me",
  asyncHandler(profileController.getMe.bind(profileController))
);

profileRouter.patch(
  "/me",
  validate(updateMyProfileSchema),
  asyncHandler(profileController.updateMe.bind(profileController))
);

profileRouter.patch(
  "/me/password",
  validate(changeMyPasswordSchema),
  asyncHandler(profileController.changePassword.bind(profileController))
);

profileRouter.get(
  "/me/articles",
  validate(profilePaginationQuerySchema),
  asyncHandler(profileController.myArticles.bind(profileController))
);

profileRouter.get(
  "/me/bookmarks",
  validate(profilePaginationQuerySchema),
  asyncHandler(profileController.myBookmarks.bind(profileController))
);

export { profileRouter };
