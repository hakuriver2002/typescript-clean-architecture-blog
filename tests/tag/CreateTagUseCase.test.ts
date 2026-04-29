import { describe, expect, it, vi } from "vitest";
import { CreateTagUseCase } from "../../src/application/use-cases/tag/CreateTagUseCase";
import { AppError } from "../../src/shared/AppError";
import { createTagRepositoryMock } from "../helpers/repositoryMocks";

describe("CreateTagUseCase", () => {
  it("creates tag with normalized slug", async () => {
    const repo = createTagRepositoryMock();
    repo.findByName = vi.fn().mockResolvedValue(null);
    repo.create = vi.fn().mockResolvedValue({
      id: "tag-1",
      name: "Karatedo News",
      slug: "karatedo-news",
      createdAt: new Date("2026-04-29T00:00:00.000Z"),
      updatedAt: new Date("2026-04-29T00:00:00.000Z"),
    });

    const useCase = new CreateTagUseCase(repo);
    const result = await useCase.execute({ name: "Karatedo News" });

    expect(repo.create).toHaveBeenCalledWith({
      name: "Karatedo News",
      slug: "karatedo-news",
    });
    expect(result.slug).toBe("karatedo-news");
  });

  it("rejects duplicate tag name", async () => {
    const repo = createTagRepositoryMock();
    repo.findByName = vi.fn().mockResolvedValue({
      id: "tag-1",
      name: "Karatedo",
      slug: "karatedo",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const useCase = new CreateTagUseCase(repo);

    await expect(useCase.execute({ name: "Karatedo" })).rejects.toMatchObject<AppError>({
      message: "Tag with this name already exists",
      statusCode: 409,
    });
  });
});
