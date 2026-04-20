import { TagRepository, CreateTagInput } from "../../../domain/repositories/TagRepository";
import { CreateTagDTO } from "../../../application/dto/tag/TagDTO";
import { TagResponseDTO } from "../../../application/dto/tag/TagDTO";

export class GetAllTagsUseCase {
    constructor(private tagRepo: TagRepository) { }

    async execute(page: number = 1, pageSize: number = 10): Promise<{
        data: TagResponseDTO[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }> {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 10;

        const result = await this.tagRepo.findAll(page, pageSize);

        return {
            data: result.data.map((tag) => this.mapToDTO(tag)),
            total: result.total,
            page,
            pageSize,
            totalPages: Math.ceil(result.total / pageSize),
        };
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