import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr from 'vite-plugin-svgr'

const host = process.env.TAURI_DEV_HOST

export default defineConfig(async () => ({
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"]
    }
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: { 
        exportType: "default", 
        ref: false, svgo: false, titleProp: false, prettier: false, expandProps:true,
        icon: true, dimensions: false
      },
      include: "**/*.svg"
    })
  ],
  build: {
    minify: true,
    assetsInlineLimit: 0,
    rollupOptions: { 
      input: { 
        main: "index.html",
        splash: "splash.html"
      }, 
    },
  }
}))
