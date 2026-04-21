import sharp from "sharp";
import { ImageProcessor } from "../../domain/repositories/ImageProcessor";

export class SharpImageProcessor implements ImageProcessor {
  async process(
    input: Buffer,
    options: {
      maxWidth: number;
      maxHeight: number;
      thumbnailWidth: number;
      thumbnailHeight: number;
    },
  ) {
    const originalImage = sharp(input, { animated: true, failOn: "none" });
    const originalBuffer = await originalImage
      .resize({
        width: options.maxWidth,
        height: options.maxHeight,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });

    const thumbnailImage = sharp(input, { animated: true, failOn: "none" });
    const thumbnailBuffer = await thumbnailImage
      .resize({
        width: options.thumbnailWidth,
        height: options.thumbnailHeight,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 75 })
      .toBuffer({ resolveWithObject: true });

    return {
      original: {
        buffer: originalBuffer.data,
        contentType: "image/webp",
        extension: "webp",
        width: originalBuffer.info.width,
        height: originalBuffer.info.height,
      },
      thumbnail: {
        buffer: thumbnailBuffer.data,
        contentType: "image/webp",
        extension: "webp",
        width: thumbnailBuffer.info.width,
        height: thumbnailBuffer.info.height,
      },
    };
  }
}
