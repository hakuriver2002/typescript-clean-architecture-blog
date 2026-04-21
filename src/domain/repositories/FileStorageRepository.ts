export interface UploadFileInput {
  bucket: string;
  path: string;
  buffer: Buffer;
  contentType: string;
}

export interface UploadedFile {
  path: string;
  publicUrl: string;
}

export interface FileStorageRepository {
  upload(input: UploadFileInput): Promise<UploadedFile>;
}
