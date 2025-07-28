
// /* eslint-env node */

// import path              from "path"
// import { fileURLToPath } from "url"
// import { defineConfig, loadEnv } from "vite"
// import react             from "@vitejs/plugin-react"
// import tailwindcss       from "@tailwindcss/vite"

// export default defineConfig(({ mode }) => {
//   // 1) __dirname shim for ESM
//   const __dirname = path.dirname(fileURLToPath(import.meta.url))

//   // 2) Load all env vars from .env, .env.[mode], and process.env
//   //    Prefix filter '' so we pick up VITE_API_URL, VITE_CLIENT_URL, etc.
//   const env = loadEnv(mode, __dirname, "")

//   // 3) Pull values out (guaranteed to be strings if set in environment)
//   const isDev     = mode === "development"
//   const apiUrl    = env.VITE_API_URL    || "http://localhost:5000"
//   const clientUrl = env.VITE_CLIENT_URL || "http://localhost:3000"

//   return {
//     base: "/",
//     plugins: [
//       react(),       // JSX + Fast Refresh
//       tailwindcss(), // Tailwind integration
//     ],
//     resolve: {
//       alias: {
//         "@": path.resolve(__dirname, "src"),
//       },
//     },

//     // 4) Dev‐server only
//     server: isDev
//       ? {
//           port: 3000,
//           strictPort: true,
//           cors: {
//             origin:      clientUrl,
//             credentials: true,
//           },
//           proxy: {
//             "/api": {
//               target:       apiUrl,
//               changeOrigin: true,
//               secure:       false,
//             },
//             "/uploads": {
//               target:       apiUrl,
//               changeOrigin: true,
//             },
//             "/socket.io": {
//               target:       apiUrl,
//               changeOrigin: true,
//               ws:           true,
//               secure:       false,
//             },
//           },
//         }
//       : undefined,

//     // 5) Expose these values inside your client code as import.meta.env.VITE_*
//     define: {
//       "import.meta.env.VITE_API_URL":    JSON.stringify(apiUrl),
//       "import.meta.env.VITE_CLIENT_URL": JSON.stringify(clientUrl),
//     },

//     // 6) Production build
//     build: {
//       outDir:    "dist",
//       sourcemap: false,
//     },
//   }
// })

/* eslint-env node */
import path              from "path"
import { fileURLToPath } from "url"
import { defineConfig, loadEnv } from "vite"
import react             from "@vitejs/plugin-react"
import tailwindcss       from "@tailwindcss/vite"

export default defineConfig(({ mode }) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const env       = loadEnv(mode, __dirname, "")
  const isDev     = mode === "development"

  const apiUrl    = env.VITE_API_URL    || "http://localhost:5000"
  const clientUrl = env.VITE_CLIENT_URL || "http://localhost:3000"

  return {
    // Emit absolute URLs so <base href="/"> can resolve them
    base: "/",

    plugins: [
      react(),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    server: isDev
      ? {
          port: 3000,
          strictPort: true,
          cors: {
            origin:      clientUrl,
            credentials: true,
          },
          proxy: {
            "/api":      { target: apiUrl,    changeOrigin: true, secure: false },
            "/uploads":  { target: apiUrl,    changeOrigin: true        },
            "/socket.io":{ target: apiUrl,    changeOrigin: true, ws: true, secure: false },
          },
        }
      : undefined,

    define: {
      "import.meta.env.VITE_API_URL":    JSON.stringify(apiUrl),
      "import.meta.env.VITE_CLIENT_URL": JSON.stringify(clientUrl),
    },

    build: {
      outDir:    "dist",
      assetsDir: "assets",    // <— put everything under /assets
      sourcemap: false,
      rollupOptions: {
        output: {
          // give predictable, namespaced filenames
          entryFileNames:  "assets/[name].[hash].js",
          chunkFileNames:  "assets/[name].[hash].js",
          assetFileNames:  "assets/[name].[hash].[ext]",
        },
      },
    },
  }
})
