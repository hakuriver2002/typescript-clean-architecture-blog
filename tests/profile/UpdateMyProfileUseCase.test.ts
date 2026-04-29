import { describe, expect, it, vi } from "vitest";
import { UpdateMyProfileUseCase } from "../../src/application/use-cases/profile/UpdateMyProfileUseCase";
import { AppError } from "../../src/shared/AppError";
import { createUserRepositoryMock } from "../helpers/repositoryMocks";

describe("UpdateMyProfileUseCase", () => {
  it("updates profile and returns updated user", async () => {
    const repo = createUserRepositoryMock();
    repo.findById = vi
      .fn()
      .mockResolvedValueOnce({
        id: "user-1",
        email: "user@example.com",
        fullName: "Old Name",
        avatarUrl: null,
        role: "MEMBER",
        status: "ACTIVE",
        passwordHash: "hash",
        createdAt: new Date("2026-04-29T00:00:00.000Z"),
        updatedAt: new Date("2026-04-29T00:00:00.000Z"),
      })
      .mockResolvedValueOnce({
        id: "user-1",
        email: "user@example.com",
        fullName: "New Name",
        avatarUrl: "https://example.com/avatar.jpg",
        role: "MEMBER",
        status: "ACTIVE",
        passwordHash: "hash",
        createdAt: new Date("2026-04-29T00:00:00.000Z"),
        updatedAt: new Date("2026-04-29T00:00:00.000Z"),
      });
    repo.updateProfile = vi.fn().mockResolvedValue(undefined);

    const useCase = new UpdateMyProfileUseCase(repo);
    const result = await useCase.execute({
      userId: "user-1",
      fullName: "New Name",
      avatarUrl: "https://example.com/avatar.jpg",
    });

    expect(repo.updateProfile).toHaveBeenCalledWith("user-1", {
      fullName: "New Name",
      avatarUrl: "https://example.com/avatar.jpg",
    });
    expect(result.fullName).toBe("New Name");
  });

  it("rejects when user does not exist", async () => {
    const repo = createUserRepositoryMock();
    repo.findById = vi.fn().mockResolvedValue(null);

    const useCase = new UpdateMyProfileUseCase(repo);

    await expect(
      useCase.execute({ userId: "missing", fullName: "Name" }),
    ).rejects.toMatchObject<AppError>({
      message: "User not found",
      statusCode: 404,
    });
  });
});
