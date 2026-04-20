-- 1) Role enum evolution (preserve existing data)
ALTER TYPE "Role" RENAME VALUE 'USER' TO 'MEMBER';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'EDITOR';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'TRAINER';

-- 2) New enums
DO $$ BEGIN
  CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PENDING', 'PUBLISHED', 'REJECTED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ArticleReviewAction" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED', 'REVISED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "CommentStatus" AS ENUM ('VISIBLE', 'HIDDEN', 'DELETED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "MedalType" AS ENUM ('GOLD', 'SILVER', 'BRONZE', 'NONE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3) User table data-safe changes
ALTER TABLE "User" RENAME COLUMN "name" TO "fullName";
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "googleId" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "status" "UserStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;

-- set existing users active
UPDATE "User" SET "status" = 'ACTIVE' WHERE "status" = 'PENDING';

CREATE UNIQUE INDEX IF NOT EXISTS "User_googleId_key" ON "User"("googleId");

-- 4) Article table + migrate existing Post rows
CREATE TABLE IF NOT EXISTS "Article" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "excerpt" TEXT,
  "thumbnailUrl" TEXT,
  "category" TEXT,
  "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "viewCount" INTEGER NOT NULL DEFAULT 0,
  "publishedAt" TIMESTAMP(3),
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Article_slug_key" ON "Article"("slug");
CREATE INDEX IF NOT EXISTS "Article_authorId_idx" ON "Article"("authorId");
CREATE INDEX IF NOT EXISTS "Article_status_publishedAt_idx" ON "Article"("status", "publishedAt");

INSERT INTO "Article" (
  "id", "title", "slug", "content", "excerpt", "thumbnailUrl", "status", "publishedAt", "authorId", "createdAt", "updatedAt"
)
SELECT
  p."id",
  p."title",
  p."slug",
  p."content",
  p."excerpt",
  p."coverImage",
  CASE WHEN p."published" THEN 'PUBLISHED'::"ArticleStatus" ELSE 'DRAFT'::"ArticleStatus" END,
  p."publishedAt",
  p."authorId",
  p."createdAt",
  p."updatedAt"
FROM "Post" p
ON CONFLICT ("id") DO NOTHING;

ALTER TABLE "Article"
  ADD CONSTRAINT "Article_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 5) New tables
CREATE TABLE IF NOT EXISTS "ArticleReview" (
  "id" TEXT NOT NULL,
  "articleId" TEXT NOT NULL,
  "reviewerId" TEXT NOT NULL,
  "action" "ArticleReviewAction" NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ArticleReview_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ArticleReview_articleId_idx" ON "ArticleReview"("articleId");
CREATE INDEX IF NOT EXISTS "ArticleReview_reviewerId_idx" ON "ArticleReview"("reviewerId");

CREATE TABLE IF NOT EXISTS "Comment" (
  "id" TEXT NOT NULL,
  "articleId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "parentId" TEXT,
  "content" TEXT NOT NULL,
  "status" "CommentStatus" NOT NULL DEFAULT 'VISIBLE',
  "hiddenById" TEXT,
  "hiddenReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Comment_articleId_idx" ON "Comment"("articleId");
CREATE INDEX IF NOT EXISTS "Comment_userId_idx" ON "Comment"("userId");
CREATE INDEX IF NOT EXISTS "Comment_parentId_idx" ON "Comment"("parentId");

CREATE TABLE IF NOT EXISTS "Notification" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "articleId" TEXT,
  "commentId" TEXT,
  "actorId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");
CREATE INDEX IF NOT EXISTS "Notification_articleId_idx" ON "Notification"("articleId");
CREATE INDEX IF NOT EXISTS "Notification_commentId_idx" ON "Notification"("commentId");

CREATE TABLE IF NOT EXISTS "ArticleLike" (
  "id" TEXT NOT NULL,
  "articleId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ArticleLike_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ArticleLike_articleId_userId_key" ON "ArticleLike"("articleId", "userId");
CREATE INDEX IF NOT EXISTS "ArticleLike_articleId_idx" ON "ArticleLike"("articleId");
CREATE INDEX IF NOT EXISTS "ArticleLike_userId_idx" ON "ArticleLike"("userId");

CREATE TABLE IF NOT EXISTS "ArticleBookmark" (
  "id" TEXT NOT NULL,
  "articleId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ArticleBookmark_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ArticleBookmark_articleId_userId_key" ON "ArticleBookmark"("articleId", "userId");
CREATE INDEX IF NOT EXISTS "ArticleBookmark_articleId_idx" ON "ArticleBookmark"("articleId");
CREATE INDEX IF NOT EXISTS "ArticleBookmark_userId_idx" ON "ArticleBookmark"("userId");

CREATE TABLE IF NOT EXISTS "AthleteProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "dateOfBirth" TIMESTAMP(3),
  "height" DOUBLE PRECISION,
  "weight" DOUBLE PRECISION,
  "club" TEXT,
  "discipline" TEXT,
  "currentBelt" TEXT,
  "coachName" TEXT,
  "bio" TEXT,
  "isPublic" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AthleteProfile_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "AthleteProfile_userId_key" ON "AthleteProfile"("userId");

CREATE TABLE IF NOT EXISTS "Achievement" (
  "id" TEXT NOT NULL,
  "athleteId" TEXT NOT NULL,
  "tournamentName" TEXT NOT NULL,
  "level" TEXT,
  "medal" "MedalType" NOT NULL DEFAULT 'NONE',
  "year" INTEGER NOT NULL,
  "discipline" TEXT,
  "location" TEXT,
  "weightCategory" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Achievement_athleteId_idx" ON "Achievement"("athleteId");

CREATE TABLE IF NOT EXISTS "Belt" (
  "id" TEXT NOT NULL,
  "athleteId" TEXT NOT NULL,
  "belt" TEXT NOT NULL,
  "achievedAt" TIMESTAMP(3) NOT NULL,
  "examiner" TEXT,
  "location" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Belt_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Belt_athleteId_idx" ON "Belt"("athleteId");

-- 6) Foreign keys for new tables
ALTER TABLE "ArticleReview" ADD CONSTRAINT "ArticleReview_articleId_fkey"
  FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ArticleReview" ADD CONSTRAINT "ArticleReview_reviewerId_fkey"
  FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Comment" ADD CONSTRAINT "Comment_articleId_fkey"
  FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_hiddenById_fkey"
  FOREIGN KEY ("hiddenById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_articleId_fkey"
  FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_commentId_fkey"
  FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_actorId_fkey"
  FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ArticleLike" ADD CONSTRAINT "ArticleLike_articleId_fkey"
  FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ArticleLike" ADD CONSTRAINT "ArticleLike_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ArticleBookmark" ADD CONSTRAINT "ArticleBookmark_articleId_fkey"
  FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ArticleBookmark" ADD CONSTRAINT "ArticleBookmark_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AthleteProfile" ADD CONSTRAINT "AthleteProfile_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_athleteId_fkey"
  FOREIGN KEY ("athleteId") REFERENCES "AthleteProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Belt" ADD CONSTRAINT "Belt_athleteId_fkey"
  FOREIGN KEY ("athleteId") REFERENCES "AthleteProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 7) Drop old table after successful copy
DROP TABLE IF EXISTS "Post";