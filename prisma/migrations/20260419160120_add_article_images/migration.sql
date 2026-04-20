/*
  Warnings:

  - You are about to drop the column `inlineImage` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "inlineImage";

-- CreateTable
CREATE TABLE "ArticleImages" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "articleId" TEXT NOT NULL,

    CONSTRAINT "ArticleImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ArticleImages_articleId_idx" ON "ArticleImages"("articleId");

-- AddForeignKey
ALTER TABLE "ArticleImages" ADD CONSTRAINT "ArticleImages_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
