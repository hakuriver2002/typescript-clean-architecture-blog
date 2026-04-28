export interface ActiveTagStat {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

export interface LatestArticleStat {
  id: string;
  title: string;
  slug: string;
  viewCount: number;
  status: string;
  createdAt: Date;
}

export interface PendingUserItem {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
}

export interface DashboardOverview {
  range: {
    type: "7d" | "30d" | "custom";
    startDate: Date;
    endDate: Date;
  };
  totalArticles: number;
  viewsInRange: number;
  newCommentsInRange: number;
  weeklyApprovalStats: {
    approved: number;
    rejected: number;
    pending: number;
    approvedRate: number;
    rejectedRate: number;
    pendingRate: number;
  };
  activeTags: ActiveTagStat[];
  topAuthors: Array<{
    authorId: string;
    fullName: string;
    email: string;
    publishedCount: number;
    totalViews: number;
  }>;
  latestArticles: LatestArticleStat[];
  actionRequiredArticles: Array<{
    id: string;
    title: string;
    slug: string;
    createdAt: Date;
    pendingHours: number;
  }>;
  pendingUsers: PendingUserItem[];
  pendingUsersTotal: number;
}

export interface DashboardRepository {
  getOverview(input: {
    range: "7d" | "30d" | "custom";
    startDate: Date;
    endDate: Date;
  }): Promise<DashboardOverview>;
}
