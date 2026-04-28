import { Request, Response } from "express";
import { container } from "../../../infrastructure/container";

export class DashboardController {
  async overview(req: Request, res: Response) {
    const range = (req.query.range as "7d" | "30d" | "custom") ?? "7d";

    let startDate: Date;
    let endDate: Date;
    if (range === "custom") {
      startDate = new Date(String(req.query.startDate));
      endDate = new Date(String(req.query.endDate));
    } else {
      endDate = new Date();
      const days = range === "7d" ? 7 : 30;
      startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - days + 1);
      startDate.setHours(0, 0, 0, 0);
    }

    const result = await container.getDashboardOverviewUseCase.execute({
      range,
      startDate,
      endDate,
    });
    return res.status(200).json({
      ...result,
      notes: {
        viewsInRange:
          "Calculated from articles updated in selected range (includes view increments and other article updates).",
        weeklyApprovalStats:
          "Field name kept for backward compatibility, values are calculated in selected range.",
      },
    });
  }
}

export const dashboardController = new DashboardController();
