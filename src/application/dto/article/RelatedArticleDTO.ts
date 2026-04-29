import { ArticleResponseDTO } from "./ArticleDTO";

export type RelatedArticleReason = "tag" | "category";

export interface RelatedArticleDTO extends ArticleResponseDTO {
  reason: RelatedArticleReason;
}
