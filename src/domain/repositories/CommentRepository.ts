import { Comment } from "../entities/Comment";

export interface CreateCommentInput {
    id: string;
    articleId: string;
    userId: string;
    content: string;
    parentId: string | null;
    deletedAt: Date | null;
    createdAt: Date;
}


export interface CommentRepository {
    findById(id: string): Promise<Comment | null>;
    create(comment: CreateCommentInput): Promise<Comment>;
    softDelete(id: string): Promise<void>;
}