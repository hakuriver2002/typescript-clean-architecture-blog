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

const userRepository = new PrismaUserRepository();
const articleRepository = new PrismaArticleRepository();
// const postRepository = new PrismaPostRepository();
const tagRepository = new PrismaTagRepository();
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
};