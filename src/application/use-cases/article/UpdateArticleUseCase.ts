import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { TagRepository } from "../../../domain/repositories/TagRepository";
import { UpdateArticleInput } from "../../../domain/repositories/ArticleRepository";
import { ArticleDTOMapper } from "../../mappers/ArticleDTOMapper";
import { AppError } from "../../../shared/AppError";

export class UpdateArticleUseCase {
    constructor(
        private articleRepo: ArticleRepository,
        private tagRepo: TagRepository,
    ) { }

    async execute(id: string, input: UpdateArticleInput) {
        const article = await this.articleRepo.findById(id);
        if (!article) throw new AppError("Article not found", 404);

        if (input.tagIds) {
            if (input.tagIds.length > 3) {
                throw new AppError("Maximum 3 tags allowed", 400);
            }

            const tags = await this.tagRepo.findByIds(input.tagIds);
            if (tags.length !== input.tagIds.length) {
                throw new AppError("Some tags are invalid", 400);
            }
        }

        const updated = await this.articleRepo.update(id, input);
        return ArticleDTOMapper.toDTO(updated);
    }
}
