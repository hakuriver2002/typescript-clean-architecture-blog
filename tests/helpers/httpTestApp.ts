import cookieParser from "cookie-parser";
import express from "express";

type CreateHttpTestAppOptions = {
  useCookieParser?: boolean;
};

export async function createHttpTestApp(
  loadRouter: () => Promise<express.Router>,
  mountPath: string,
  options: CreateHttpTestAppOptions = {},
) {
  const { errorHandler } = await import("../../src/interface/http/middlewares/errorHandler");

  const app = express();

  if (options.useCookieParser) {
    app.use(cookieParser());
  }

  app.use(express.json());
  app.use(mountPath, await loadRouter());
  app.use(errorHandler);

  return app;
}
