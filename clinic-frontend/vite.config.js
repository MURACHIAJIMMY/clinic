
// import path from "path"
// import { fileURLToPath } from "url"
// import { defineConfig } from "vite"
// import react from "@vitejs/plugin-react"
// import tailwindcss from "@tailwindcss/vite"

// const __dirname = path.dirname(fileURLToPath(import.meta.url))

// export default defineConfig(({ mode }) => {
//   const isDev = mode === "development"

//   return {
//     base: "/",                                 // adjust if you serve from a sub-path
//     plugins: [
//       react(),                                 // JSX + fast refresh
//       tailwindcss()                            // Tailwind on Vite
//     ],
//     resolve: {
//       alias: {
//         "@": path.resolve(__dirname, "src")    // "@/components/…" → "src/components/…"
//       }
//     },
//     // Only used during `vite dev`
//     server: isDev
//       ? {
//           proxy: {
//             // Forward `/api` to your local Express
//             "/api": {
//               target: "http://localhost:5000",
//               changeOrigin: true,
//               secure: false
//             },
//             // Serve uploads via the same backend
//             "/uploads": {
//               target: "http://localhost:5000",
//               changeOrigin: true
//             },
//             // Proxy Socket.IO websocket traffic
//             "/socket.io": {
//               target: "http://localhost:5000",
//               ws: true,
//               changeOrigin: true
//             }
//           }
//         }
//       : undefined,
//     build: {
//       outDir: "dist",                          // your production bundle
//       sourcemap: false,                        // set true if you need prod source-maps
//       rollupOptions: {
//         // customize code-splitting or asset handling here
//       }
//     }
//   }
// })

/* eslint-env node */

import path              from "path"
import { fileURLToPath } from "url"
import { defineConfig, loadEnv } from "vite"
import react             from "@vitejs/plugin-react"
import tailwindcss       from "@tailwindcss/vite"

export default defineConfig(({ mode }) => {
  // 1) __dirname shim for ESM
  const __dirname = path.dirname(fileURLToPath(import.meta.url))

  // 2) Load all env vars from .env, .env.[mode], and process.env
  //    Prefix filter '' so we pick up VITE_API_URL, VITE_CLIENT_URL, etc.
  const env = loadEnv(mode, __dirname, "")

  // 3) Pull values out (guaranteed to be strings if set in environment)
  const isDev     = mode === "development"
  const apiUrl    = env.VITE_API_URL    || "http://localhost:5000"
  const clientUrl = env.VITE_CLIENT_URL || "http://localhost:3000"

  return {
    base: "/",
    plugins: [
      react(),       // JSX + Fast Refresh
      tailwindcss(), // Tailwind integration
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    // 4) Dev‐server only
    server: isDev
      ? {
          port: 3000,
          strictPort: true,
          cors: {
            origin:      clientUrl,
            credentials: true,
          },
          proxy: {
            "/api": {
              target:       apiUrl,
              changeOrigin: true,
              secure:       false,
            },
            "/uploads": {
              target:       apiUrl,
              changeOrigin: true,
            },
            "/socket.io": {
              target:       apiUrl,
              changeOrigin: true,
              ws:           true,
              secure:       false,
            },
          },
        }
      : undefined,

    // 5) Expose these values inside your client code as import.meta.env.VITE_*
    define: {
      "import.meta.env.VITE_API_URL":    JSON.stringify(apiUrl),
      "import.meta.env.VITE_CLIENT_URL": JSON.stringify(clientUrl),
    },

    // 6) Production build
    build: {
      outDir:    "dist",
      sourcemap: false,
    },
  }
})
