import { ArticleLike } from "../entities/ArticleLike";


export interface LikeRepository {
    find(userId: string, articleId: string): Promise<ArticleLike | null>;
    create(data: ArticleLike): Promise<void>;
    delete(userId: string, articleId: string): Promise<void>;
}