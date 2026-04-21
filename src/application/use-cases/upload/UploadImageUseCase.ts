import { AuthUser } from "../../../domain/entities/Auth";
import { FileStorageRepository } from "../../../domain/repositories/FileStorageRepository";
import { ImageProcessor } from "../../../domain/repositories/ImageProcessor";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/AppError";
import { env } from "../../../infrastructure/config/env";

type UploadTarget = "article" | "avatar";

export class UploadImageUseCase {
  constructor(
    private readonly storage: FileStorageRepository,
    private readonly imageProcessor: ImageProcessor,
    private readonly userRepository: UserRepository,
  ) { }

  async execute(input: {
    target: UploadTarget;
    actor?: AuthUser;
    fileBuffer: Buffer;
  }) {
    if (input.target === "article" && !input.actor) {
      throw new AppError("Unauthorized", 401);
    }

    const now = new Date();
    const yyyy = String(now.getUTCFullYear());
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(now.getUTCDate()).padStart(2, "0");
    const id = crypto.randomUUID();

    const processed = await this.imageProcessor.process(input.fileBuffer, {
      maxWidth: 1920,
      maxHeight: 1920,
      thumbnailWidth: input.target === "avatar" ? 256 : 480,
      thumbnailHeight: input.target === "avatar" ? 256 : 480,
    });

    const basePath = input.target === "article"
      ? `article/${yyyy}/${mm}/${dd}`
      : `avatar/${yyyy}/${mm}/${dd}/${input.actor?.id ?? "guest"}`;
    const filePath = `${basePath}/${id}.${processed.original.extension}`;
    const thumbPath = `${basePath}/${id}-thumb.${processed.thumbnail.extension}`;

    const bucket = input.target === "article"
      ? env.SUPABASE_STORAGE_BUCKET_ARTICLES
      : env.SUPABASE_STORAGE_BUCKET_AVATARS;

    const [uploadedOriginal, uploadedThumb] = await Promise.all([
      this.storage.upload({
        bucket,
        path: filePath,
        buffer: processed.original.buffer,
        contentType: processed.original.contentType,
      }),
      this.storage.upload({
        bucket,
        path: thumbPath,
        buffer: processed.thumbnail.buffer,
        contentType: processed.thumbnail.contentType,
      }),
    ]);

    let avatarUpdated = false;
    if (input.target === "avatar" && input.actor?.id) {
      await this.userRepository.updateAvatarUrl(input.actor.id, uploadedOriginal.publicUrl);
      avatarUpdated = true;
    }

    return {
      target: input.target,
      originalUrl: uploadedOriginal.publicUrl,
      thumbnailUrl: uploadedThumb.publicUrl,
      avatarUpdated,
      width: processed.original.width,
      height: processed.original.height,
      thumbnailWidth: processed.thumbnail.width,
      thumbnailHeight: processed.thumbnail.height,
    };
  }
}
