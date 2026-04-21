import { Comment } from "../entities/Comment";

export interface CreateCommentInput {
  articleId: string;
  userId: string;
  content: string;
  parentId?: string | null;
}

export interface CommentAuthorSummary {
  id: string;
  fullName: string;
  avatarUrl: string | null;
}

export interface CommentWithAuthor extends Comment {
  author: CommentAuthorSummary;
}

export interface CommentNode extends CommentWithAuthor {
  replies: CommentWithAuthor[];
}

export interface ListCommentsResult {
  data: CommentNode[];
  total: number;
}

export interface CommentRepository {
  findById(id: string): Promise<Comment | null>;
  findByIdWithAuthor(id: string): Promise<CommentWithAuthor | null>;
  findByArticleId(articleId: string, page: number, pageSize: number): Promise<ListCommentsResult>;
  create(comment: CreateCommentInput): Promise<CommentWithAuthor>;
  updateStatus(id: string, status: Comment["status"]): Promise<void>;
}
