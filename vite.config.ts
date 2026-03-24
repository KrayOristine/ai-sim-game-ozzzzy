import path from "path";
import { defineConfig } from "vite";
import react, {reactCompilerPreset} from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import legacy from "@vitejs/plugin-legacy";
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
        optimize: true
      }),
      legacy(),
      react(),
      babel({
        presets: [reactCompilerPreset({
          compilationMode: "all"
        })]
      })
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
      assetsDir: "./assets",
      outDir: "../dist",
      emptyOutDir: true,
      cssMinify: false,
      sourcemap: true,
      rolldownOptions: {
        experimental: {
          nativeMagicString: true,
          lazyBarrel: true,
        },
        output: {
          minify: true,
          comments: {
            legal: true,
            annotation: false,
            jsdoc: false,
          },
          codeSplitting: {
            maxSize: 1024 * 1024 * 3,
            groups: [
              {
                test: /node_modules[\\/].*(react|scheduler)/i,
                name: 'react',
                priority: 10000,
                entriesAware: true
              },
              {
                test: /node_modules[\\/].*google/i,
                name: 'google',
                priority: 10000,
                entriesAware: true,
              },
              {
                test: /node_modules[\\/]/i,
                name: 'vendor',
                entriesAware: true,
              },
              {
                test: /services/i,
                name: 'core',
                entriesAware: true
              },
              {
                test: /(utils|constants|const\.ts)/i,
                name: 'utility',
                entriesAware: true,
                entriesAwareMergeThreshold: 1024 * 10,
              },
              {
                test: /components[\\/]helper/i,
                name: 'component',
                entriesAware: true,
                entriesAwareMergeThreshold: 1024 * 20,
              },
              {
                test: /components[\\/]main/i,
                name: 'ui',
                entriesAware: true,
              },
            ]
          }
        },
      },
    },
  };
});
