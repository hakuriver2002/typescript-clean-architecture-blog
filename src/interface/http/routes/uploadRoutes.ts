import { Router } from "express";
import { uploadController } from "../controllers/UploadController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authMiddleware } from "../middlewares/authMiddleware";
import { singleImageUpload } from "../middlewares/uploadImage";

const uploadRouter = Router();

uploadRouter.post(
  "/images",
  authMiddleware,
  singleImageUpload,
  asyncHandler(uploadController.uploadArticleImage.bind(uploadController)),
);

uploadRouter.post(
  "/avatar",
  authMiddleware,
  singleImageUpload,
  asyncHandler(uploadController.uploadAvatar.bind(uploadController)),
);

export { uploadRouter };
