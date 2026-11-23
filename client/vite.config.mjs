import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const backendDir = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig(({ mode }) => {
  const { PORT = "5000", DEMO_MODE, STATIC_DEMO } = loadEnv(mode, backendDir, [
    "PORT",
    "DEMO_MODE",
    "STATIC_DEMO",
  ]);
  const staticDemo = STATIC_DEMO === "true";

  return {
    plugins: [react()],
    define: {
      "import.meta.env.DEMO_MODE": JSON.stringify(staticDemo || DEMO_MODE === "true"),
      "import.meta.env.STATIC_DEMO": JSON.stringify(staticDemo),
    },
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
