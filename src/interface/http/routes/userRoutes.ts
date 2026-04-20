import { Router } from "express";
import { userController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requirePermission } from "../middlewares/requirePermission";
import { validate } from "../middlewares/validate";
import { listUsersSchema, updateUserStatusSchema, updateUserRoleSchema } from "../validators/userValidators";
import { asyncHandler } from "../middlewares/asyncHandler";

const userRouter = Router();

userRouter.get(
  "/",
  authMiddleware,
  requirePermission("manage_users"),
  validate(listUsersSchema),
  asyncHandler(userController.list.bind(userController)),
);

userRouter.get(
  "/pending",
  authMiddleware,
  requirePermission("manage_users"),
  validate(listUsersSchema),
  asyncHandler(userController.listPending.bind(userController)),
)


// UPDATE STATUS PENDING || APPROVED || REJECTED || INACTIVE (BANNED)
userRouter.patch(
  "/:id/status",
  authMiddleware,
  requirePermission("manage_users"),
  validate(updateUserStatusSchema),
  asyncHandler(userController.updateStatus.bind(userController)),
);

// UPDATE ROLE ADMIN || EDITOR || TRAINER || MEMBER
userRouter.patch(
  "/:id/role",
  authMiddleware,
  requirePermission("manage_users"),
  validate(updateUserRoleSchema),
  asyncHandler(userController.updateRole.bind(userController)),
);

export { userRouter };