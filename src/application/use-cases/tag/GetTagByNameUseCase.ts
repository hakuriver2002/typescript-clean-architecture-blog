import { TagRepository } from "../../../domain/repositories/TagRepository";
import { TagResponseDTO } from "../../../application/dto/tag/TagDTO";
import { TagDTOMapper } from "../../mappers/TagDTOMapper";
import { AppError } from "../../../shared/AppError";


export class GetTagByNameUseCase {
    constructor(private tagRepo: TagRepository) { }

    async execute(name: string): Promise<TagResponseDTO> {
        const tag = await this.tagRepo.findByName(name);

        if (!tag) {
            throw new AppError("Tag not found", 404);
        }

        return TagDTOMapper.toDTO(tag);
    }
}
