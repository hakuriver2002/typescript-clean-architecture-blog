import { prisma } from "../db/prisma";
import { DashboardOverview, DashboardRepository } from "../../domain/repositories/DashboardRepository";

export class PrismaDashboardRepository implements DashboardRepository {
  async getOverview(input: {
    range: "7d" | "30d" | "custom";
    startDate: Date;
    endDate: Date;
  }): Promise<DashboardOverview> {
    const now = new Date();
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    const [
      totalArticles,
      viewsInRangeAgg,
      newCommentsInRange,
      latestArticles,
      pendingUsers,
      pendingUsersTotal,
      activeTagGroups,
      activeTagEntities,
      weeklyStatusGroups,
      actionRequiredArticles,
      topAuthorGroups,
    ] = await Promise.all([
      prisma.article.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      prisma.article.aggregate({
        where: {
          updatedAt: { gte: startDate, lte: endDate },
        },
        _sum: { viewCount: true },
      }),
      prisma.comment.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: "VISIBLE",
        },
      }),
      prisma.article.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          viewCount: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.user.findMany({
        where: { status: "PENDING" },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.user.count({ where: { status: "PENDING" } }),
      prisma.articleTag.groupBy({
        by: ["tagId"],
        where: {
          article: { status: "PUBLISHED" },
        },
        _count: { tagId: true },
        orderBy: { _count: { tagId: "desc" } },
        take: 8,
      }),
      prisma.tag.findMany({
        where: {
          articles: {
            some: {
              article: { status: "PUBLISHED" },
            },
          },
        },
        select: { id: true, name: true, slug: true },
      }),
      prisma.article.groupBy({
        by: ["status"],
        where: {
          updatedAt: { gte: startDate, lte: endDate },
          status: { in: ["PUBLISHED", "REJECTED", "PENDING"] },
        },
        _count: { _all: true },
      }),
      prisma.article.findMany({
        where: { status: "PENDING" },
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
        take: 8,
      }),
      prisma.article.groupBy({
        by: ["authorId"],
        where: { status: "PUBLISHED" },
        _count: { _all: true },
        _sum: { viewCount: true },
        orderBy: { _sum: { viewCount: "desc" } },
        take: 8,
      }),
    ]);

    const tagMap = new Map(activeTagEntities.map((t) => [t.id, t]));
    const activeTags = activeTagGroups
      .map((g) => {
        const tag = tagMap.get(g.tagId);
        if (!tag) return null;
        return {
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
          articleCount: g._count.tagId,
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);

    const weeklyApproved = weeklyStatusGroups.find((s) => s.status === "PUBLISHED")?._count._all ?? 0;
    const weeklyRejected = weeklyStatusGroups.find((s) => s.status === "REJECTED")?._count._all ?? 0;
    const weeklyPending = weeklyStatusGroups.find((s) => s.status === "PENDING")?._count._all ?? 0;
    const weeklyTotal = weeklyApproved + weeklyRejected + weeklyPending;

    const topAuthorUsers = await prisma.user.findMany({
      where: {
        id: { in: topAuthorGroups.map((g) => g.authorId) },
      },
      select: { id: true, fullName: true, email: true },
    });
    const topAuthorUserMap = new Map(topAuthorUsers.map((u) => [u.id, u]));
    const topAuthors = topAuthorGroups.map((g) => {
      const user = topAuthorUserMap.get(g.authorId);
      return {
        authorId: g.authorId,
        fullName: user?.fullName ?? "Unknown",
        email: user?.email ?? "",
        publishedCount: g._count._all,
        totalViews: g._sum.viewCount ?? 0,
      };
    });

    return {
      range: {
        type: input.range,
        startDate,
        endDate,
      },
      totalArticles,
      viewsInRange: viewsInRangeAgg._sum.viewCount ?? 0,
      newCommentsInRange,
      weeklyApprovalStats: {
        approved: weeklyApproved,
        rejected: weeklyRejected,
        pending: weeklyPending,
        approvedRate: weeklyTotal ? Number(((weeklyApproved / weeklyTotal) * 100).toFixed(2)) : 0,
        rejectedRate: weeklyTotal ? Number(((weeklyRejected / weeklyTotal) * 100).toFixed(2)) : 0,
        pendingRate: weeklyTotal ? Number(((weeklyPending / weeklyTotal) * 100).toFixed(2)) : 0,
      },
      activeTags,
      topAuthors,
      latestArticles: latestArticles.map((a) => ({
        ...a,
        status: a.status,
      })),
      actionRequiredArticles: actionRequiredArticles.map((a) => ({
        ...a,
        pendingHours: Math.floor((now.getTime() - a.createdAt.getTime()) / (1000 * 60 * 60)),
      })),
      pendingUsers: pendingUsers.map((u) => ({
        ...u,
        role: u.role,
        status: u.status,
      })),
      pendingUsersTotal,
    };
  }
}
