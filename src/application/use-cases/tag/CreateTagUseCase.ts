import { TagRepository, CreateTagInput } from "../../../domain/repositories/TagRepository";
import { CreateTagDTO } from "../../../application/dto/tag/TagDTO";
import { TagResponseDTO } from "../../../application/dto/tag/TagDTO";

export class CreateTagUseCase {
    constructor(private tagRepo: TagRepository) { }

    async execute(input: CreateTagDTO): Promise<TagResponseDTO> {
        const existingTag = await this.tagRepo.findByName(input.name);
        if (existingTag) {
            throw new Error("Tag with this name already exists");
        }

        const slug = this.generateSlug(input.name);

        const tag = await this.tagRepo.create({
            name: input.name,
            slug,
        });

        return this.mapToDTO(tag);
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