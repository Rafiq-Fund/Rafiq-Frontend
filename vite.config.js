import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Explicitly set output directory
    emptyOutDir: true, // Clear the directory before build
    sourcemap: true, // Helpful for debugging
  },
});
