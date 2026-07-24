import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.port, () => {
  console.log(`TaskFlow API running in ${env.nodeEnv} mode on port ${env.port}`);
  console.log(`Health check: http://localhost:${env.port}/api/health`);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});
