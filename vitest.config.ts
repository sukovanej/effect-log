import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["test/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    reporters: ["hanging-process", "default"],
    sequence: {
      concurrent: true
    },
    alias: {
      "effect-log": path.resolve(__dirname, "src")
    }
  }
})
