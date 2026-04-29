import { TagRepository } from "../../../domain/repositories/TagRepository";
import { CreateTagDTO } from "../../../application/dto/tag/TagDTO";
import { TagResponseDTO } from "../../../application/dto/tag/TagDTO";
import { TagDTOMapper } from "../../mappers/TagDTOMapper";
import { AppError } from "../../../shared/AppError";

export class CreateTagUseCase {
    constructor(private tagRepo: TagRepository) { }

    async execute(input: CreateTagDTO): Promise<TagResponseDTO> {
        const existingTag = await this.tagRepo.findByName(input.name);
        if (existingTag) {
            throw new AppError("Tag with this name already exists", 409);
        }

        const slug = this.generateSlug(input.name);

        const tag = await this.tagRepo.create({
            name: input.name,
            slug,
        });

        return TagDTOMapper.toDTO(tag);
    }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");
    }
}
