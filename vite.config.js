import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr from 'vite-plugin-svgr'

const host = "127.0.0.1"

export default defineConfig(async () => ({
  clearScreen: false,
  server: {
    port: 5350,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 5351,
        }
      : undefined,
    watch: {
      ignored: ["srcpy/**", "_pyenv/**"]
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
