export type ArticleStatus = "DRAFT" | "PUBLISHED" | "PENDING" | "REJECTED" | "ARCHIVED";

export enum ArticleCategory {
    CLUB_NEWS = 'club_news',
    EVENTS = 'events',
    REGIONAL_NEWS = 'regional_news',
    INTERNAL = 'internal',
}

export type ArticleCategoryType = keyof typeof ArticleCategory;