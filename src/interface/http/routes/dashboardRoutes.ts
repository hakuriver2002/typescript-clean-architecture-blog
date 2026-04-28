import { Router } from "express";
import { dashboardController } from "../controllers/DashboardController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requirePermission } from "../middlewares/requirePermission";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validate } from "../middlewares/validate";
import { dashboardOverviewQuerySchema } from "../validators/dashboardValidators";

const dashboardRouter = Router();

dashboardRouter.get(
  "/overview",
  authMiddleware,
  requirePermission("view_dashboard"),
  validate(dashboardOverviewQuerySchema),
  asyncHandler(dashboardController.overview.bind(dashboardController)),
);

export { dashboardRouter };
