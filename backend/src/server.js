import { config } from "./config/env.js";
import { connectToDatabase, disconnectFromDatabase } from "./db/connection.js";
import { createApp } from "./app.js";

const SHUTDOWN_TIMEOUT_MS = 8000;

const app = createApp();

let server;
let isShuttingDown = false;

async function start() {
  try {
    await connectToDatabase(config.mongoUri);
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }

  server = app.listen(config.port, "0.0.0.0", (error) => {
    if (error) {
      console.error(`Failed to start server: ${error.message}`);
      process.exit(1);
    }
    console.log(`Backend is running on port ${config.port}`);
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
