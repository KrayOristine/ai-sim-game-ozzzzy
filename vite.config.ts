import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
//import vitePluginBundleObfuscator from "vite-plugin-bundle-obfuscator";

const match = function (str: string, rgx: RegExp) {
  return rgx.test(str);
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    root: "./src",
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [
      react({
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
      }),
      tailwindcss({}),
      /*vitePluginBundleObfuscator({
        excludes: [],
        enable: false,
        log: true,
        autoExcludeNodeModules: {
          enable: true,
          manualChunks: ['react', 'google', 'scheduler']
        },
        threadPool: true,
        apply: 'build',
        options: {
          compact: true,
          identifierNamesGenerator: "mangled-shuffled",
          numbersToExpressions: true,
          renameGlobals: true,
          renameProperties: true,
          selfDefending: true,
          simplify: true,
          ignoreImports: true,
          splitStrings: true,
          stringArray: true,
          stringArrayEncoding: ['rc4', 'base64'],
          stringArrayIndexesType: ['hexadecimal-numeric-string'],
          stringArrayCallsTransform: true,
          stringArrayCallsTransformThreshold: 0.1
        },
      }),*/
    ],
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "#": path.resolve(__dirname, "src"),
        "@comps": path.resolve(__dirname, "src/components"),
        "@srvs": path.resolve(__dirname, "src/services"),
        "@util": path.resolve(__dirname, "src/utils"),
        "@game": path.resolve(__dirname, "src/game"),
        "@prompt": path.resolve(__dirname, "src/prompts"),
        "@const": path.resolve(__dirname, "src/constants")
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
      rollupOptions: {
        output: {
          compact: true,
          generatedCode: {
            constBindings: true,
            objectShorthand: true,
          },
          manualChunks: function (id) {
            const isReact = match(id, /react/i);
            const isGoogle = match(id, /google/i);
            const pathName = path.dirname(id);
            const fileName = path.basename(id);

            if (isReact || match(pathName, /scheduler/i)) {
              return "react";
            }

            if (isGoogle) {
              return "google";
            }

            if ((!isReact || !isGoogle) && match(pathName, /node_modules/i)) {
              return "vendor";
            }

            if (match(pathName, /services/i)) {
              return "core";
            }

            if (
              match(pathName, /(utils|constants)/i) ||
              match(fileName, /const/i)
            ) {
              return "utility";
            }

            if (match(pathName, /components/i)) {
              const arr = pathName.split("/");
              switch (arr[arr.length - 1]) {
                case "main":
                  return "ui-ux";
                case "helper":
                  return "components";

                default:
                  return "other";
              }
            }

            return null;
          },
        },
      },
    },
  };
});
