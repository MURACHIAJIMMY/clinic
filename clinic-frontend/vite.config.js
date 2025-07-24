
import path from "path"
import { fileURLToPath } from "url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const isDev = mode === "development"

  return {
    base: "/",                                 // adjust if you serve from a sub-path
    plugins: [
      react(),                                 // JSX + fast refresh
      tailwindcss()                            // Tailwind on Vite
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")    // "@/components/…" → "src/components/…"
      }
    },
    // Only used during `vite dev`
    server: isDev
      ? {
          proxy: {
            // Forward `/api` to your local Express
            "/api": {
              target: "http://localhost:5000",
              changeOrigin: true,
              secure: false
            },
            // Serve uploads via the same backend
            "/uploads": {
              target: "http://localhost:5000",
              changeOrigin: true
            },
            // Proxy Socket.IO websocket traffic
            "/socket.io": {
              target: "http://localhost:5000",
              ws: true,
              changeOrigin: true
            }
          }
        }
      : undefined,
    build: {
      outDir: "dist",                          // your production bundle
      sourcemap: false,                        // set true if you need prod source-maps
      rollupOptions: {
        // customize code-splitting or asset handling here
      }
    }
  }
})
