import { describe, expect, it, vi } from "vitest";
import { UpdateTagUseCase } from "../../src/application/use-cases/tag/UpdateTagUseCase";
import { AppError } from "../../src/shared/AppError";
import { createTagRepositoryMock } from "../helpers/repositoryMocks";

describe("UpdateTagUseCase", () => {
  it("updates tag and regenerates slug", async () => {
    const repo = createTagRepositoryMock();
    repo.findById = vi.fn().mockResolvedValue({
      id: "tag-1",
      name: "Old Name",
      slug: "old-name",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    repo.findByName = vi.fn().mockResolvedValue(null);
    repo.update = vi.fn().mockResolvedValue({
      id: "tag-1",
      name: "New Name",
      slug: "new-name",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const useCase = new UpdateTagUseCase(repo);
    const result = await useCase.execute("tag-1", { name: "New Name" });

    expect(repo.update).toHaveBeenCalledWith("tag-1", {
      name: "New Name",
      slug: "new-name",
    });
    expect(result.slug).toBe("new-name");
  });

  it("rejects update when tag is missing", async () => {
    const repo = createTagRepositoryMock();
    repo.findById = vi.fn().mockResolvedValue(null);

    const useCase = new UpdateTagUseCase(repo);

    await expect(useCase.execute("missing", { name: "New Name" })).rejects.toMatchObject<AppError>({
      message: "Tag not found",
      statusCode: 404,
    });
  });
});
