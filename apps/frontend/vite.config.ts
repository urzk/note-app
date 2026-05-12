import { defineConfig } from "vite";
import electron from "vite-plugin-electron/simple";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    electron({
      main: {
        // Shortcut of `build.lib.entry`
        entry: "electron/main.ts",
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`
        input: "electron/preload.ts",
      },
      // Optional: Use Node.js API in the Renderer process
      renderer: {},
    }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
    tsconfigPaths(),
  ],
  server: {
    proxy: {
      "/v1": "http://localhost:3000",
    },
  },
  resolve: {
    conditions: ["module"],
  },
  worker: {
    format: "es",
  },
});
