import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { TagRepository } from "../../../domain/repositories/TagRepository";
import { UpdateArticleInput } from "../../../domain/repositories/ArticleRepository";

export class UpdateArticleUseCase {
    constructor(
        private articleRepo: ArticleRepository,
        private tagRepo: TagRepository,
    ) { }

    async execute(id: string, input: UpdateArticleInput) {
        const article = await this.articleRepo.findById(id);
        if (!article) throw new Error("Article not found");

        if (input.tagIds) {
            if (input.tagIds.length > 3) {
                throw new Error("Max 3 tags");
            }

            const tags = await this.tagRepo.findByIds(input.tagIds);
            if (tags.length !== input.tagIds.length) {
                throw new Error("Invalid tag");
            }
        }

        return this.articleRepo.update(id, input);
    }
}