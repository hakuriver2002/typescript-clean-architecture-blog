import multer from "multer";
import { AppError } from "../../../shared/AppError";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new AppError("Invalid image format. Allowed: jpg, png, webp, gif", 422));
      return;
    }
    cb(null, true);
  },
});

export const singleImageUpload = upload.single("file");
