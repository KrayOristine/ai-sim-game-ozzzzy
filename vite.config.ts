import path from "path";
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import babel from "@rolldown/plugin-babel";

export default defineConfig(() => {
  return {
    root: "./src",
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [
      tailwindcss({
        optimize: true,
      }),
      react(),
      babel({
        presets: [
          reactCompilerPreset({
            compilationMode: "annotation",
          }),
        ],
      }),
    ],
    resolve: {
      alias: {
        "#": path.resolve(__dirname, "src"),
        "@component": path.resolve(__dirname, "src/components"),
        "@service": path.resolve(__dirname, "src/services"),
        "@utils": path.resolve(__dirname, "src/utils"),
        "@game": path.resolve(__dirname, "src/game"),
        "@prompt": path.resolve(__dirname, "src/prompts"),
        "@const": path.resolve(__dirname, "src/constants"),
      },
    },
    css: {
      postcss: "./postcss.config.js",
    },
    build: {
      target: "esnext",
      assetsDir: "./assets",
      outDir: "../dist",
      emptyOutDir: true,
      cssMinify: false,
      sourcemap: false,
      rolldownOptions: {
        output: {
          minify: true,
          sourcemap: false,
          comments: {
            legal: true,
            annotation: false,
            jsdoc: false,
          },
          codeSplitting: {
            maxSize: 1024 * 1024 * 5,
            groups: [
              {
                test: /node_modules[\\/].*(react|scheduler)/i,
                name: "react",
                priority: 10000,
              },
              {
                test: /node_modules[\\/].*google/i,
                name: "google",
                priority: 9999,
              },
              {
                test: /node_modules[\\/]/i,
                name: "vendor",
                entriesAware: true,
              },
              {
                test: /[\\/]services[\\/]/i,
                name: "core",
                entriesAware: true,
              },
              {
                test: /[\\/](utils|constants|const\.ts)/i,
                name: "utility",
                entriesAware: true,
              },
              {
                test: /components[\\/]helper/i,
                name: "component",
                entriesAware: true,
              },
              {
                test: /components[\\/]main/i,
                name: "ui",
                entriesAware: true,
              },
            ],
          },
        },
      },
    },
  };
});
