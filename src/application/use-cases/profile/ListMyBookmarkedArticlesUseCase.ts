import { BookmarkRepository } from "../../../domain/repositories/BookmarkRepository";
import { AppError } from "../../../shared/AppError";

export class ListMyBookmarkedArticlesUseCase {
  constructor(private readonly bookmarkRepository: BookmarkRepository) { }

  async execute(input: { userId: string; page: number; pageSize: number }) {
    if (input.page < 1) throw new AppError("Page must be greater than 0", 400);
    if (input.pageSize < 1 || input.pageSize > 100) {
      throw new AppError("Page size must be between 1 and 100", 400);
    }

    const result = await this.bookmarkRepository.listByUser(input.userId, input.page, input.pageSize);
    return {
      data: result.data,
      total: result.total,
      page: input.page,
      pageSize: input.pageSize,
      totalPages: Math.ceil(result.total / input.pageSize),
    };
  }
}
