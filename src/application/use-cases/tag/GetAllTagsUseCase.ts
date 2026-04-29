import { TagRepository } from "../../../domain/repositories/TagRepository";
import { TagResponseDTO } from "../../../application/dto/tag/TagDTO";
import { TagDTOMapper } from "../../mappers/TagDTOMapper";

export class GetAllTagsUseCase {
    constructor(private tagRepo: TagRepository) { }

    async execute(page: number = 1, pageSize: number = 10, search?: string): Promise<{
        data: TagResponseDTO[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }> {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 10;

        const result = await this.tagRepo.findAll(page, pageSize, search?.trim() || undefined);

        return TagDTOMapper.toPaginatedDTO({
            data: result.data,
            total: result.total,
            page,
            pageSize,
        });
    }
}
