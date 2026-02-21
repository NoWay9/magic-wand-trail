import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/magicWandTrail.js"),
      name: "MagicWandTrail",
      fileName: (format) => `magicWandTrail.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    minify: "terser",
    target: "esnext",
  },
  test: {
    environment: "jsdom",
  },
});
