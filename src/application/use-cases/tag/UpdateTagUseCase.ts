import { TagRepository, CreateTagInput } from "../../../domain/repositories/TagRepository";
import { CreateTagDTO } from "../../../application/dto/tag/TagDTO";
import { TagResponseDTO } from "../../../application/dto/tag/TagDTO";

export class UpdateTagUseCase {
    constructor(private tagRepo: TagRepository) { }

    async execute(id: string, input: any): Promise<TagResponseDTO> {
        // Check if tag exists
        const existingTag = await this.tagRepo.findById(id);
        if (!existingTag) {
            throw new Error("Tag not found");
        }

        // Check if new name already exists (if name is being updated)
        if (input.name && input.name !== existingTag.name) {
            const tagWithSameName = await this.tagRepo.findByName(input.name);
            if (tagWithSameName) {
                throw new Error("Tag with this name already exists");
            }
        }

        // Update tag
        const updatedTag = await this.tagRepo.update(id, {
            name: input.name,
            slug: input.name ? this.generateSlug(input.name) : undefined,
        });

        return this.mapToDTO(updatedTag);
    }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");
    }

    private mapToDTO(tag: any): TagResponseDTO {
        return {
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            createdAt: tag.createdAt,
            updatedAt: tag.updatedAt,
        };
    }
}