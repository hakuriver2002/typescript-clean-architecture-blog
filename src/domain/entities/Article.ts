import { ArticleStatus } from "../enums/article";
import { Tag } from "./Tag";

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnailUrl: string | null;
  category: string | null;
  status: ArticleStatus;
  rejectionReason?: string;
  approvedBy?: string;
  isFeatured: boolean;
  viewCount: number;
  publishedAt: Date | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: Tag[];
}