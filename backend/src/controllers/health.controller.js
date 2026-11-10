import { isDatabaseConnected } from "../db/connection.js";

export function getHealth(req, res) {
  const databaseUp = isDatabaseConnected();
  res.status(databaseUp ? 200 : 503).json({
    status: databaseUp ? "ok" : "error",
    database: databaseUp ? "up" : "down",
  });
}
