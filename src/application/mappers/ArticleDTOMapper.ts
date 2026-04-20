import { Article } from "../../domain/entities/Article";
import { ArticleResponseDTO } from "../dto/article/ArticleDTO";
import { buildArticleUrl } from "../../domain/utils/buildArticleUrl";

export class ArticleDTOMapper {
    static toDTO(article: Article) {
        return {
            ...article,
            url: buildArticleUrl(article.slug, article.id),
        };
    }
}