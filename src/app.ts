import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { authRouter } from "./interface/http/routes/authRoutes";
import { articleRouter } from "./interface/http/routes/articleRoutes";
import { userRouter } from "./interface/http/routes/userRoutes";
import { errorHandler } from "./interface/http/middlewares/errorHandler";
import { env } from "./infrastructure/config/env";
import { AppError } from "./shared/AppError";
import { tagRouter } from "./interface/http/routes/tagRoutes";

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/articles", articleRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tags", tagRouter);

app.use((_req, _res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(errorHandler);

export { app };