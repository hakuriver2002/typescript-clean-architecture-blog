import { TagRepository, CreateTagInput } from "../../../domain/repositories/TagRepository";
import { CreateTagDTO } from "../../../application/dto/tag/TagDTO";
import { TagResponseDTO } from "../../../application/dto/tag/TagDTO";

export class DeleteTagUseCase {
    constructor(private tagRepo: TagRepository) { }

    async execute(id: string): Promise<void> {
        // Check if tag exists
        const tag = await this.tagRepo.findById(id);
        if (!tag) {
            throw new Error("Tag not found");
        }

        // Delete tag
        await this.tagRepo.delete(id);
    }
}