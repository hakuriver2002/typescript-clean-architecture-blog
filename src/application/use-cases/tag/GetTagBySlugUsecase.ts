import { TagRepository } from "../../../domain/repositories/TagRepository";
import { TagResponseDTO } from "../../../application/dto/tag/TagDTO";
import { TagDTOMapper } from "../../mappers/TagDTOMapper";
import { AppError } from "../../../shared/AppError";


export class GetTagBySlugUseCase {
    constructor(private tagRepo: TagRepository) { }

    async execute(slug: string): Promise<TagResponseDTO> {
        const tag = await this.tagRepo.findBySlug(slug);

        if (!tag) {
            throw new AppError("Tag not found", 404);
        }

        return TagDTOMapper.toDTO(tag);
    }
}
