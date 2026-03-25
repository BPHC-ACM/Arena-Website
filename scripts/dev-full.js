const { spawn } = require("child_process");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

const startProcess = (label, args, cwd) => {
  const child = spawn("pnpm", args, {
    cwd,
    stdio: "inherit",
    shell: true,
    env: process.env,
  });

  child.on("error", (error) => {
    console.error(`[${label}] failed to start:`, error.message);
  });

  return child;
};

const frontend = startProcess("frontend", ["dev"], rootDir);
const backend = startProcess("backend", ["--dir", "server", "dev"], rootDir);

const shutdown = () => {
  frontend.kill();
  backend.kill();
};

process.on("SIGINT", () => {
  shutdown();
  process.exit(0);
});

process.on("SIGTERM", () => {
  shutdown();
  process.exit(0);
});

frontend.on("exit", (code) => {
  if (code && code !== 0) {
    console.error(`[frontend] exited with code ${code}`);
  }
  backend.kill();
  process.exit(code || 0);
});

backend.on("exit", (code) => {
  if (code && code !== 0) {
    console.error(`[backend] exited with code ${code}`);
  }
  frontend.kill();
  process.exit(code || 0);
});
