import path from "path"

import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"

const commonConfig = defineConfig({
  plugins: [vue()],
  define: {
    __VUE_OPTIONS_API__: false,
  },
})

const libConfig = defineConfig({
  ...commonConfig,
  build: {
    target: "esnext",
    minify: false,
    lib: {
      formats: ["es"],
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "VueToastification",
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue"],
      output: {
        // Use `index.css` for css
        assetFileNames: assetInfo => {
          if (assetInfo.name == "style.css") return "index.css"
          return assetInfo.name || ''
        },
      },
    },
  },
})

const demoConfig = defineConfig({
  ...commonConfig,
  root: "./demo",
})

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const executionMode: "lib" | "demo" =
    (process.env.MODE as "lib" | "demo") || "lib"

  const mode = command === "build" ? "production" : "development"

  if (executionMode === "demo") {
    return { ...demoConfig, mode }
  } 

  return { ...libConfig, mode }
})
