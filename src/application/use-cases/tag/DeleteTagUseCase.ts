import { TagRepository } from "../../../domain/repositories/TagRepository";
import { AppError } from "../../../shared/AppError";

export class DeleteTagUseCase {
    constructor(private tagRepo: TagRepository) { }

    async execute(id: string): Promise<void> {
        const tag = await this.tagRepo.findById(id);
        if (!tag) {
            throw new AppError("Tag not found", 404);
        }

        await this.tagRepo.delete(id);
    }
}
