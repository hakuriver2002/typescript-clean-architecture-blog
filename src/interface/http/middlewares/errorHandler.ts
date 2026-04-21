import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { AppError } from "../../../shared/AppError";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details,
    });
  }

  if (err instanceof MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE"
      ? "File too large. Maximum size is 5MB."
      : err.message;
    return res.status(422).json({ message });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
}
