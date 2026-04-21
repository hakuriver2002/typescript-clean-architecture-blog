import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";
import { AppError } from "../../shared/AppError";
import { FileStorageRepository, UploadFileInput } from "../../domain/repositories/FileStorageRepository";

export class SupabaseStorageRepository implements FileStorageRepository {
  private readonly client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  async upload(input: UploadFileInput) {
    const { error } = await this.client.storage
      .from(input.bucket)
      .upload(input.path, input.buffer, {
        contentType: input.contentType,
        upsert: false,
      });

    if (error) {
      throw new AppError(`Storage upload failed: ${error.message}`, 500);
    }

    const publicUrl = `${env.SUPABASE_URL}/storage/v1/object/public/${input.bucket}/${input.path}`;
    return {
      path: input.path,
      publicUrl,
    };
  }
}
