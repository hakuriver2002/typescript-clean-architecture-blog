import { RegisterUseCase } from "../application/use-cases/auth/RegisterUseCase";
import { LoginUseCase } from "../application/use-cases/auth/LoginUseCase";
import { GetMeUseCase } from "../application/use-cases/auth/GetMeUseCase";
import { CreateSessionUseCase } from "../application/use-cases/auth/CreateSessionUseCase";
import { RefreshSessionUseCase } from "../application/use-cases/auth/RefreshSessionUseCase";
import { LogoutUseCase } from "../application/use-cases/auth/LogoutUseCase";
import { ForgotPasswordUseCase } from "../application/use-cases/auth/ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "../application/use-cases/auth/ResetPasswordUseCase";
import { ListUsersUseCase } from "../application/use-cases/users/ListUsersUseCase";
import { UpdateUserStatusUseCase } from "../application/use-cases/users/UpdateUserStatusUseCase";

import { PrismaRefreshTokenRepository } from "./repositories/PrismaRefreshTokenRepository";
import { PrismaPasswordResetTokenRepository } from "./repositories/PrismaPasswordResetTokenRepository";
import { BcryptService } from "./security/BcryptService";
import { JwtService } from "./security/JwtService";
import { ConsoleEmailService } from "./security/ConsoleEmailService";
import { SmtpEmailService } from "./security/SmtpEmailService";
import { env } from "./config/env";

import { PrismaUserRepository } from "./repositories/PrismaUserRepository";
import { GetPendingUsersUseCase } from "../application/use-cases/users/GetPendingUsersUseCase";
import { ApproveUserUseCase } from "../application/use-cases/users/ApproveUserUseCase";
import { RejectUserUseCase } from "../application/use-cases/users/RejectUserUseCase";
import { UpdateUserRoleUsecase } from "../application/use-cases/users/UpdateUserRoleUseCase";
import { ListPendingUsersUseCase } from "../application/use-cases/users/ListPendingUsersUsecase";

import { PrismaTagRepository } from "./repositories/PrismaTagRepository";
import { CreateTagUseCase } from "../application/use-cases/tag/CreateTagUseCase";
import { GetAllTagsUseCase } from "../application/use-cases/tag/GetAllTagsUseCase";
import { GetTagByIdUseCase } from "../application/use-cases/tag/GetTagByIdUseCase";
import { UpdateTagUseCase } from "../application/use-cases/tag/UpdateTagUseCase";
import { DeleteTagUseCase } from "../application/use-cases/tag/DeleteTagUseCase";
import { GetTagBySlugUseCase } from "../application/use-cases/tag/GetTagBySlugUsecase";
import { GetTagByNameUseCase } from "../application/use-cases/tag/GetTagByNameUseCase";
import { CreateArticleUseCase } from "../application/use-cases/article/CreateArticleUseCase";
import { UpdateArticleUseCase } from "../application/use-cases/article/UpdateArticleUseCase";
import { ListPublicArticlesUseCase } from "../application/use-cases/article/ListPublicArticlesUseCase";
import { DeleteArticleUseCase } from "../application/use-cases/article/DeleteArticleUseCase";
import { SubmitArticleUseCase } from "../application/use-cases/article/SubmitArticleUseCase";
import { PrismaArticleRepository } from "./repositories/PrismaArticleRepository";
import { GetArticleByIdUseCase } from "../application/use-cases/article/GetArticleByIdUseCase";
import { GetArticleBySlugUseCase } from "../application/use-cases/article/GetArticleBySlugUseCase";
import { ListMyArticlesUseCase } from "../application/use-cases/article/ListMyArticlesUseCase";
import { ApproveArticleUseCase } from "../application/use-cases/article/ApproveArticleUseCase";
import { RejectArticleUseCase } from "../application/use-cases/article/RejectArticleUseCase";
import { ToggleLikeArticleUseCase } from "../application/use-cases/article/ToggleLikeArticleUseCase";
import { ToggleBookmarkArticleUseCase } from "../application/use-cases/article/ToggleBookmarkArticleUseCase";
import { ListFeaturedArticlesUseCase } from "../application/use-cases/article/ListFeaturedArticlesUseCase";
import { ListTrendingArticlesUseCase } from "../application/use-cases/article/ListTrendingArticlesUseCase";
import { PrismaCommentRepository } from "./repositories/PrismaCommentRepository";
import { CreateCommentUseCase } from "../application/use-cases/comment/CreateCommentUseCase";
import { DeleteCommentUseCase } from "../application/use-cases/comment/DeleteCommentUseCase";
import { ListCommentsByArticleUseCase } from "../application/use-cases/comment/ListCommentsByArticleUseCase";
import { ReplyCommentUseCase } from "../application/use-cases/comment/ReplyCommentUseCase";
import { UploadImageUseCase } from "../application/use-cases/upload/UploadImageUseCase";
import { SupabaseStorageRepository } from "./storage/SupabaseStorageRepository";
import { SharpImageProcessor } from "./images/SharpImageProcessor";
import { PrismaBookmarkRepository } from "./repositories/PrismaBookmarkRepository";
import { PrismaLikeRepository } from "./repositories/PrismaLikeRepository";
import { GetMyProfileUseCase } from "../application/use-cases/profile/GetMyProfileUseCase";
import { UpdateMyProfileUseCase } from "../application/use-cases/profile/UpdateMyProfileUseCase";
import { ChangeMyPasswordUseCase } from "../application/use-cases/profile/ChangeMyPasswordUseCase";
import { ListMyBookmarkedArticlesUseCase } from "../application/use-cases/profile/ListMyBookmarkedArticlesUseCase";
import { PrismaDashboardRepository } from "./repositories/PrismaDashboardRepository";
import { GetDashboardOverviewUseCase } from "../application/use-cases/dashboard/GetDashboardOverviewUseCase";

const userRepository = new PrismaUserRepository();
const articleRepository = new PrismaArticleRepository();
// const postRepository = new PrismaPostRepository();
const tagRepository = new PrismaTagRepository();
const commentRepository = new PrismaCommentRepository();
const bookmarkRepository = new PrismaBookmarkRepository();
const likeRepository = new PrismaLikeRepository();
const storageRepository = new SupabaseStorageRepository();
const imageProcessor = new SharpImageProcessor();
const dashboardRepository = new PrismaDashboardRepository();
const createCommentUseCase = new CreateCommentUseCase(commentRepository, articleRepository);
const refreshTokenRepository = new PrismaRefreshTokenRepository();
const passwordResetTokenRepository = new PrismaPasswordResetTokenRepository();
const hashService = new BcryptService();
const tokenService = new JwtService();

const emailService =
  env.SMTP_HOST && env.SMTP_FROM
    ? new SmtpEmailService()
    : new ConsoleEmailService();

export const container = {

  // ===Auth Usecase===
  registerUseCase: new RegisterUseCase(userRepository, hashService),
  loginUseCase: new LoginUseCase(userRepository, hashService),
  createSessionUseCase: new CreateSessionUseCase(tokenService, refreshTokenRepository, userRepository),
  refreshSessionUseCase: new RefreshSessionUseCase(tokenService, refreshTokenRepository, userRepository),
  logoutUseCase: new LogoutUseCase(refreshTokenRepository),
  forgotPasswordUseCase: new ForgotPasswordUseCase(
    userRepository,
    passwordResetTokenRepository,
    emailService,
  ),
  resetPasswordUseCase: new ResetPasswordUseCase(
    userRepository,
    passwordResetTokenRepository,
    hashService,
  ),
  getMeUseCase: new GetMeUseCase(userRepository),

  // ===User Usecase===
  listUsersUseCase: new ListUsersUseCase(userRepository),
  listPendingUsersUseCase: new ListPendingUsersUseCase(userRepository),
  updateUserStatusUseCase: new UpdateUserStatusUseCase(userRepository),
  updateUserRoleUseCase: new UpdateUserRoleUsecase(userRepository),
  getPendingUsersUseCase: new GetPendingUsersUseCase(userRepository),
  approveUserUseCase: new ApproveUserUseCase(userRepository),
  rejectUserUseCase: new RejectUserUseCase(userRepository),

  // ===Article Usecase===
  createArticleUseCase: new CreateArticleUseCase(articleRepository, tagRepository),
  updateArticleUseCase: new UpdateArticleUseCase(articleRepository, tagRepository),
  submitArticleUseCase: new SubmitArticleUseCase(articleRepository),
  deleteArticleUseCase: new DeleteArticleUseCase(articleRepository),
  listPublicArticlesUseCase: new ListPublicArticlesUseCase(articleRepository),
  listMyArticlesUseCase: new ListMyArticlesUseCase(articleRepository),
  getArticleByIdUseCase: new GetArticleByIdUseCase(articleRepository),
  getArticleBySlugUseCase: new GetArticleBySlugUseCase(articleRepository),
  approveArticleUseCase: new ApproveArticleUseCase(articleRepository),
  rejectArticleUseCase: new RejectArticleUseCase(articleRepository),
  toggleLikeArticleUseCase: new ToggleLikeArticleUseCase(articleRepository, likeRepository),
  toggleBookmarkArticleUseCase: new ToggleBookmarkArticleUseCase(articleRepository, bookmarkRepository),
  listFeaturedArticlesUseCase: new ListFeaturedArticlesUseCase(articleRepository),
  listTrendingArticlesUseCase: new ListTrendingArticlesUseCase(articleRepository),
  // updateArticleStatusUseCase: new UpdateArticleStatusUseCase(articleRepository),
  // listArticlesByAuthorUseCase: new ListArticlesByAuthorUseCase(articleRepository),


  // ===Tag Usecase===
  createTagUseCase: new CreateTagUseCase(tagRepository),
  getAllTagsUseCase: new GetAllTagsUseCase(tagRepository),
  getTagByIdUseCase: new GetTagByIdUseCase(tagRepository),
  updateTagUseCase: new UpdateTagUseCase(tagRepository),
  deleteTagUseCase: new DeleteTagUseCase(tagRepository),
  getTagBySlugUseCase: new GetTagBySlugUseCase(tagRepository),
  getTagByNameUseCase: new GetTagByNameUseCase(tagRepository),

  // ===Comment Usecase===
  createCommentUseCase,
  replyCommentUseCase: new ReplyCommentUseCase(
    commentRepository,
    createCommentUseCase,
  ),
  deleteCommentUseCase: new DeleteCommentUseCase(commentRepository),
  listCommentsByArticleUseCase: new ListCommentsByArticleUseCase(commentRepository, articleRepository),

  // ===Upload Usecase===
  uploadImageUseCase: new UploadImageUseCase(storageRepository, imageProcessor, userRepository),

  // ===Profile Usecase===
  getMyProfileUseCase: new GetMyProfileUseCase(userRepository),
  updateMyProfileUseCase: new UpdateMyProfileUseCase(userRepository),
  changeMyPasswordUseCase: new ChangeMyPasswordUseCase(userRepository, hashService),
  listMyBookmarkedArticlesUseCase: new ListMyBookmarkedArticlesUseCase(bookmarkRepository),

  // ===Dashboard Usecase===
  getDashboardOverviewUseCase: new GetDashboardOverviewUseCase(dashboardRepository),
};
