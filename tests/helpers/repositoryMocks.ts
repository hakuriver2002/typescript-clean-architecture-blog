import { vi } from "vitest";
import { ArticleRepository } from "../../src/domain/repositories/ArticleRepository";
import { BookmarkRepository } from "../../src/domain/repositories/BookmarkRepository";
import { CommentRepository } from "../../src/domain/repositories/CommentRepository";
import { HashService } from "../../src/domain/repositories/HashService";
import { LikeRepository } from "../../src/domain/repositories/LikeRepository";
import { TagRepository } from "../../src/domain/repositories/TagRepository";
import { UserRepository } from "../../src/domain/repositories/UserRepository";

export function createArticleRepositoryMock() {
  return {
    create: vi.fn(),
    approve: vi.fn(),
    reject: vi.fn(),
    findById: vi.fn(),
    findBySlug: vi.fn(),
    findPublicArticles: vi.fn(),
    findFeaturedArticles: vi.fn(),
    findTrendingArticles: vi.fn(),
    findRelatedArticles: vi.fn(),
    incrementViewCount: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    updateStatus: vi.fn(),
    listByAuthor: vi.fn(),
  } as unknown as ArticleRepository;
}

export function createTagRepositoryMock() {
  return {
    create: vi.fn(),
    findById: vi.fn(),
    findBySlug: vi.fn(),
    findByIds: vi.fn(),
    findAll: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findByName: vi.fn(),
  } as unknown as TagRepository;
}

export function createBookmarkRepositoryMock() {
  return {
    find: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    listByUser: vi.fn(),
  } as unknown as BookmarkRepository;
}

export function createLikeRepositoryMock() {
  return {
    find: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  } as unknown as LikeRepository;
}

export function createCommentRepositoryMock() {
  return {
    findById: vi.fn(),
    findByIdWithAuthor: vi.fn(),
    findByArticleId: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
  } as unknown as CommentRepository;
}

export function createUserRepositoryMock() {
  return {
    create: vi.fn(),
    findByEmail: vi.fn(),
    findById: vi.fn(),
    list: vi.fn(),
    listPending: vi.fn(),
    updateStatus: vi.fn(),
    updateRole: vi.fn(),
    updateProfile: vi.fn(),
    updateAvatarUrl: vi.fn(),
    updatePassword: vi.fn(),
    findByStatus: vi.fn(),
  } as unknown as UserRepository;
}

export function createHashServiceMock() {
  return {
    hash: vi.fn(),
    compare: vi.fn(),
  } as unknown as HashService;
}
