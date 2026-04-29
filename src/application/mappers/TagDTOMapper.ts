import { Tag } from "../../domain/entities/Tag";
import { TagResponseDTO } from "../dto/tag/TagDTO";

export class TagDTOMapper {
    static toDTO(tag: Tag): TagResponseDTO {
        return {
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            createdAt: tag.createdAt,
            updatedAt: tag.updatedAt,
        };
    }

    static toListDTO(tags: Tag[]): TagResponseDTO[] {
        return tags.map((tag) => this.toDTO(tag));
    }

    static toPaginatedDTO(input: { data: Tag[]; total: number; page: number; pageSize: number }) {
        return {
            data: this.toListDTO(input.data),
            total: input.total,
            page: input.page,
            pageSize: input.pageSize,
            totalPages: Math.ceil(input.total / input.pageSize),
        };
    }
}
