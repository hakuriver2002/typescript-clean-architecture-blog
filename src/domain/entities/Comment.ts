import { CommentStatus } from "../enums/comment";

export interface Comment {
    id: string;
    articleId: string;
    userId: string;
    parentId: string | null;
    content: string;
    status: CommentStatus;
    hiddenById: string | null;
    hiddenReason: string | null;
    createdAt: Date;
    updatedAt: Date;
}
