import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../../../shared/AppError";

export const validate =
  (schema: { body?: z.ZodTypeAny; params?: z.ZodTypeAny; query?: z.ZodTypeAny }) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const bodyResult = schema.body?.safeParse(req.body);
    const paramsResult = schema.params?.safeParse(req.params);
    const queryResult = schema.query?.safeParse(req.query);

    if (
      (bodyResult && !bodyResult.success) ||
      (paramsResult && !paramsResult.success) ||
      (queryResult && !queryResult.success)
    ) {
      const issues = [
        ...(bodyResult && !bodyResult.success ? bodyResult.error.issues : []),
        ...(paramsResult && !paramsResult.success ? paramsResult.error.issues : []),
        ...(queryResult && !queryResult.success ? queryResult.error.issues : []),
      ];
      throw new AppError("Validation error", 422, issues);
    }

    if (bodyResult?.success) req.body = bodyResult.data;
    if (paramsResult?.success) req.params = paramsResult.data;
    if (queryResult?.success) req.query = queryResult.data;
    next();
  };