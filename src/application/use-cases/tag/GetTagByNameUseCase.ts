import { TagRepository, CreateTagInput } from "../../../domain/repositories/TagRepository";
import { CreateTagDTO } from "../../../application/dto/tag/TagDTO";
import { TagResponseDTO } from "../../../application/dto/tag/TagDTO";


export class GetTagByNameUseCase {
    constructor(private tagRepo: TagRepository) { }

    async execute(name: string): Promise<TagResponseDTO> {
        const tag = await this.tagRepo.findByName(name);

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