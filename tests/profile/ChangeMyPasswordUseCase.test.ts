import { describe, expect, it, vi } from "vitest";
import { ChangeMyPasswordUseCase } from "../../src/application/use-cases/profile/ChangeMyPasswordUseCase";
import { AppError } from "../../src/shared/AppError";
import { createHashServiceMock, createUserRepositoryMock } from "../helpers/repositoryMocks";

describe("ChangeMyPasswordUseCase", () => {
  it("changes password when current password matches", async () => {
    const userRepo = createUserRepositoryMock();
    const hashService = createHashServiceMock();

    userRepo.findById = vi.fn().mockResolvedValue({
      id: "user-1",
      passwordHash: "old-hash",
    });
    hashService.compare = vi.fn().mockResolvedValue(true);
    hashService.hash = vi.fn().mockResolvedValue("new-hash");
    userRepo.updatePassword = vi.fn().mockResolvedValue(undefined);

    const useCase = new ChangeMyPasswordUseCase(userRepo, hashService);
    const result = await useCase.execute({
      userId: "user-1",
      currentPassword: "old-password",
      newPassword: "new-password-123",
    });

    expect(userRepo.updatePassword).toHaveBeenCalledWith("user-1", "new-hash");
    expect(result).toEqual({ message: "Password changed successfully" });
  });

  it("rejects when current password is incorrect", async () => {
    const userRepo = createUserRepositoryMock();
    const hashService = createHashServiceMock();

    userRepo.findById = vi.fn().mockResolvedValue({
      id: "user-1",
      passwordHash: "old-hash",
    });
    hashService.compare = vi.fn().mockResolvedValue(false);

    const useCase = new ChangeMyPasswordUseCase(userRepo, hashService);

    await expect(
      useCase.execute({
        userId: "user-1",
        currentPassword: "wrong-password",
        newPassword: "new-password-123",
      }),
    ).rejects.toMatchObject<AppError>({
      message: "Current password is incorrect",
      statusCode: 400,
    });
  });
});
