import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Without this proxy, the frontend's relative "/api/..." calls (see
// src/services/api/client.ts's API_BASE_URL default) have nowhere to go in
// local dev — nothing was listening on this dev server's own /api path.
// Proxying to the backend also means the browser sees every request as
// same-origin, which sidesteps CORS and cookie-domain complexity entirely
// for local development (see auth.controller.ts's cookie comment for how
// this differs from the actual Vercel + Railway/Render production setup).
// eslint-disable-next-line no-undef -- vite.config.js runs in Node, `process` is real here
const BACKEND_URL = process.env.VITE_BACKEND_URL || "http://localhost:3000";

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      "/api": {
        target: BACKEND_URL,
        changeOrigin: true,
      },
    },
  },
});