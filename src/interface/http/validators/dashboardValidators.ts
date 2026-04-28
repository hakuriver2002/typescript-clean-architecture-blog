import { z } from "zod";

export const dashboardOverviewQuerySchema = {
  query: z.object({
    range: z.enum(["7d", "30d", "custom"]).default("7d"),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }).superRefine((query, ctx) => {
    if (query.range !== "custom") return;

    if (!query.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "startDate is required when range=custom",
        path: ["startDate"],
      });
    }
    if (!query.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "endDate is required when range=custom",
        path: ["endDate"],
      });
    }
    if (query.startDate && query.endDate) {
      const start = new Date(query.startDate);
      const end = new Date(query.endDate);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;
      if (start > end) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "startDate must be before or equal to endDate",
          path: ["startDate"],
        });
      }
    }
  }),
};
