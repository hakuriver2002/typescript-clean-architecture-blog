import { CommentStatus } from "../../../domain/enums/comment";
import { CommentRepository } from "../../../domain/repositories/CommentRepository";

export class DeleteCommentUseCase {
    constructor(private repo: CommentRepository) { }

    async execute(id: string, userId: string) {
        const comment = await this.repo.findById(id);
        if (!comment) throw new Error("Not found");

        if (comment.userId !== userId) {
            throw new Error("Forbidden");
        }

        await this.repo.updateStatus(id, CommentStatus.DELETE);
    }
}