import express from "express";
import cookieParser from "cookie-parser";
import { apiRouter } from "./routes/index.js";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api", apiRouter);
  return app;
}
