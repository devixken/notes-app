import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    // Same origin for the browser: /api goes to the backend, so the auth cookie just works
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
