import { describe, expect, it, vi } from "vitest";
import { IncreaseViewUseCase } from "../../src/application/use-cases/article/IncreaseViewUseCase";
import { AppError } from "../../src/shared/AppError";
import { createArticleRepositoryMock } from "../helpers/repositoryMocks";

describe("IncreaseViewUseCase", () => {
  it("increments view count when article exists", async () => {
    const repo = createArticleRepositoryMock();
    repo.findById = vi.fn().mockResolvedValue({ id: "article-1" });
    repo.incrementViewCount = vi.fn().mockResolvedValue({
      id: "article-1",
      viewCount: 11,
    });

    const useCase = new IncreaseViewUseCase(repo);
    const result = await useCase.execute("article-1");

    expect(repo.incrementViewCount).toHaveBeenCalledWith("article-1");
    expect(result).toEqual({
      id: "article-1",
      viewCount: 11,
    });
  });

  it("throws AppError when article does not exist", async () => {
    const repo = createArticleRepositoryMock();
    repo.findById = vi.fn().mockResolvedValue(null);

    const useCase = new IncreaseViewUseCase(repo);

    await expect(useCase.execute("missing")).rejects.toMatchObject<AppError>({
      message: "Article not found",
      statusCode: 404,
    });
  });
});
