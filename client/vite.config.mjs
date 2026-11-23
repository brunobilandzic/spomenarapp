import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const backendDir = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig(({ mode }) => {
  const { PORT = "5000" } = loadEnv(mode, backendDir, "PORT");

  return {
    plugins: [react()],
    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        "/api": `http://127.0.0.1:${PORT || "5000"}`,
      },
    },
    build: {
      outDir: "build",
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/setupTests.js"],
    },
  };
});
