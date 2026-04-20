import { CommentRepository } from "../../../domain/repositories/CommentRepository";

export class CreateCommentUseCase {
    constructor(private repo: CommentRepository) { }

    async execute(input: {
        articleId: string;
        userId: string;
        content: string;
        parentId?: string;
    }) {
        if (input.parentId) {
            const parent = await this.repo.findById(input.parentId);

            if (!parent) throw new Error("Parent not found");

            if (parent.parentId !== null) {
                throw new Error("Only 2 levels allowed");
            }
        }

        return this.repo.create({
            id: crypto.randomUUID(),
            articleId: input.articleId,
            userId: input.userId,
            content: input.content,
            parentId: input.parentId ?? null,
            deletedAt: null,
            createdAt: new Date(),
        });
    }
}