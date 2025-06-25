import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    allowedHosts: ['wandrr.org', 'www.wandrr.org', 'app.wandrr.org'],
    host: true, // this allows external access
  },
});
