import { describe, expect, it, vi } from "vitest";
import { ToggleBookmarkArticleUseCase } from "../../src/application/use-cases/article/ToggleBookmarkArticleUseCase";
import { createArticleRepositoryMock, createBookmarkRepositoryMock } from "../helpers/repositoryMocks";

describe("ToggleBookmarkArticleUseCase", () => {
  it("creates bookmark when bookmark does not exist", async () => {
    const articleRepo = createArticleRepositoryMock();
    const bookmarkRepo = createBookmarkRepositoryMock();

    articleRepo.findById = vi.fn().mockResolvedValue({ id: "article-1" });
    bookmarkRepo.find = vi.fn().mockResolvedValue(null);
    bookmarkRepo.create = vi.fn().mockResolvedValue(undefined);

    const useCase = new ToggleBookmarkArticleUseCase(articleRepo, bookmarkRepo);
    const result = await useCase.execute({ articleId: "article-1", userId: "user-1" });

    expect(bookmarkRepo.create).toHaveBeenCalled();
    expect(result).toEqual({
      articleId: "article-1",
      bookmarked: true,
      message: "Article bookmarked",
    });
  });

  it("removes bookmark when bookmark already exists", async () => {
    const articleRepo = createArticleRepositoryMock();
    const bookmarkRepo = createBookmarkRepositoryMock();

    articleRepo.findById = vi.fn().mockResolvedValue({ id: "article-1" });
    bookmarkRepo.find = vi.fn().mockResolvedValue({
      articleId: "article-1",
      userId: "user-1",
      createdAt: new Date(),
    });
    bookmarkRepo.delete = vi.fn().mockResolvedValue(undefined);

    const useCase = new ToggleBookmarkArticleUseCase(articleRepo, bookmarkRepo);
    const result = await useCase.execute({ articleId: "article-1", userId: "user-1" });

    expect(bookmarkRepo.delete).toHaveBeenCalledWith("user-1", "article-1");
    expect(result).toEqual({
      articleId: "article-1",
      bookmarked: false,
      message: "Bookmark removed",
    });
  });
});
