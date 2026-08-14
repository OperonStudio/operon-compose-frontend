import path from "node:path";
import { devtools } from "@tanstack/devtools-vite";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

import { morphcss } from "@morph-css/kit/vite";
import babel from "@rolldown/plugin-babel";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";

const repoRoot = path.resolve("..");

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
  plugins: [
    devtools() as any,
    morphcss() as any,
    tanstackStart() as any,
    nitro() as any,
    viteReact() as any,
    babel({ presets: [reactCompilerPreset()] }) as any,
    viteCompression({ algorithm: "brotliCompress" }) as any,
    viteCompression({ algorithm: "gzip" }) as any,
  ],
});

export default config;
