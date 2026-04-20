import bcrypt from "bcryptjs";
import { HashService } from "../../domain/repositories/HashService";

export class BcryptService implements HashService {
  hash(value: string): Promise<string> {
    return bcrypt.hash(value, 12);
  }

  compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}