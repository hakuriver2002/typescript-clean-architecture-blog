import { Bookmark } from "../entities/ArticleBookmark";
import { Article } from "../entities/Article";

export interface BookmarkRepository {
    create(data: Bookmark): Promise<void>;
    delete(userId: string, articleId: string): Promise<void>;
    listByUser(userId: string, page: number, pageSize: number): Promise<{ data: Article[]; total: number }>;
}
