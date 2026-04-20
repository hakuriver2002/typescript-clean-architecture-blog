import { Bookmark } from "../entities/ArticleBookmark";

export interface BookmarkRepository {
    create(data: Bookmark): Promise<void>;
    delete(userId: string, articleId: string): Promise<void>;
}