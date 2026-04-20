import { ArticleRepository, CreateArticleInput } from "../../../domain/repositories/ArticleRepository";
import { TagRepository } from "../../../domain/repositories/TagRepository";
import { CreateArticleDTO, ArticleResponseDTO } from "../../../application/dto/article/ArticleDTO";
import { Article } from "../../../domain/entities/Article";
import { generateSlug } from "../../../domain/utils/slug";
import { buildArticleUrl } from "../../../domain/utils/buildArticleUrl";
import { ArticleDTOMapper } from "../../mappers/ArticleDTOMapper";

export class CreateArticleUseCase {
    constructor(
        private articleRepo: ArticleRepository,
        private tagRepo: TagRepository
    ) { }

    async execute(input: CreateArticleDTO, authorId: string): Promise<ArticleResponseDTO> {

        if (input.tagIds && input.tagIds.length > 3) {
            throw new Error("Maximum 3 tags allowed");
        }

        if (input.tagIds?.length) {
            const tags = await this.tagRepo.findByIds(input.tagIds);

            if (tags.length !== input.tagIds.length) {
                throw new Error("Some tags not found");
            }
        }

        const slug = generateSlug(input.title);

        const article = await this.articleRepo.create({
            title: input.title,
            content: input.content,
            excerpt: input.excerpt,
            thumbnailUrl: input.thumbnailUrl,
            category: input.category,
            authorId,
            tagIds: input.tagIds || [],
            slug,
        });

        return ArticleDTOMapper.toDTO(article);
    }
}