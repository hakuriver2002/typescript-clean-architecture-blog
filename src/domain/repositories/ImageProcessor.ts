export interface ProcessedImage {
  original: {
    buffer: Buffer;
    contentType: string;
    extension: string;
    width: number;
    height: number;
  };
  thumbnail: {
    buffer: Buffer;
    contentType: string;
    extension: string;
    width: number;
    height: number;
  };
}

export interface ImageProcessor {
  process(
    input: Buffer,
    options: {
      maxWidth: number;
      maxHeight: number;
      thumbnailWidth: number;
      thumbnailHeight: number;
    },
  ): Promise<ProcessedImage>;
}
