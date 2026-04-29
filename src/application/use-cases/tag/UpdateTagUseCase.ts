import { TagRepository } from "../../../domain/repositories/TagRepository";
import { TagResponseDTO } from "../../../application/dto/tag/TagDTO";
import { TagDTOMapper } from "../../mappers/TagDTOMapper";
import { AppError } from "../../../shared/AppError";

export class UpdateTagUseCase {
    constructor(private tagRepo: TagRepository) { }

    async execute(id: string, input: any): Promise<TagResponseDTO> {
        const existingTag = await this.tagRepo.findById(id);
        if (!existingTag) {
            throw new AppError("Tag not found", 404);
        }

        if (input.name && input.name !== existingTag.name) {
            const tagWithSameName = await this.tagRepo.findByName(input.name);
            if (tagWithSameName) {
                throw new AppError("Tag with this name already exists", 409);
            }
        }

        const updatedTag = await this.tagRepo.update(id, {
            name: input.name,
            slug: input.name ? this.generateSlug(input.name) : undefined,
        });

        return TagDTOMapper.toDTO(updatedTag);
    }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");
    }
}
