import express from "express";
import {
  connectToDatabase,
  disconnectFromDatabase,
  isDatabaseConnected,
} from "./db.js";
import { authRouter } from "./routes/auth.js";

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const SHUTDOWN_TIMEOUT_MS = 8000;

for (const name of ["MONGO_URI", "JWT_SECRET"]) {
  if (!process.env[name]) {
    console.error(`${name} is not set`);
    process.exit(1);
  }
}

const app = express();
app.disable("x-powered-by");
app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/api/health", (req, res) => {
  const databaseUp = isDatabaseConnected();
  res.status(databaseUp ? 200 : 503).json({
    status: databaseUp ? "ok" : "error",
    database: databaseUp ? "up" : "down",
  });
});

let server;
let isShuttingDown = false;

async function start() {
  try {
    await connectToDatabase(MONGO_URI);
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }

  server = app.listen(PORT, "0.0.0.0", (error) => {
    if (error) {
      console.error(`Failed to start server: ${error.message}`);
      process.exit(1);
    }
    console.log(`Backend is running on port ${PORT}`);
  });
}

async function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`${signal} received, shutting down gracefully`);

  // Exit before Docker's 10s SIGKILL so shutdown is always logged
  const forceExit = setTimeout(() => {
    console.error("Shutdown timed out, forcing exit");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  forceExit.unref();

  try {
    if (server) {
      await new Promise((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
    await disconnectFromDatabase();
    process.exit(0);
  } catch (error) {
    console.error(`Error during shutdown: ${error.message}`);
    process.exit(1);
  }
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

start();
