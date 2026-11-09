import { Router } from "express";
import { isDatabaseConnected } from "../db/connection.js";

export const healthRouter = Router();

healthRouter.get("/", (req, res) => {
  const databaseUp = isDatabaseConnected();
  res.status(databaseUp ? 200 : 503).json({
    status: databaseUp ? "ok" : "error",
    database: databaseUp ? "up" : "down",
  });
});
