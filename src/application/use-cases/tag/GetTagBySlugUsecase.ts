import { TagRepository, CreateTagInput } from "../../../domain/repositories/TagRepository";
import { CreateTagDTO } from "../../../application/dto/tag/TagDTO";
import { TagResponseDTO } from "../../../application/dto/tag/TagDTO";


export class GetTagBySlugUseCase {
    constructor(private tagRepo: TagRepository) { }

    async execute(slug: string): Promise<TagResponseDTO> {
        const tag = await this.tagRepo.findBySlug(slug);

        if (!tag) {
            throw new Error("Tag not found");
        }

        return this.mapToDTO(tag);
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