import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr from 'vite-plugin-svgr'

const host = "127.0.0.1"

const entryFileSettings= [
  { ext:['js'], path: "data/[name]" },
]

const assetFileSettings= [
  { ext:['css'], path: "styles/[name].[ext]" },
  { ext:['png','jpg','webp'], path: "resources/[name].[ext]" },
  { ext:['ico','svg'], path: "resources/icon/[name].[ext]" },
  { ext:['ttf','otf'], path: "resources/font/[name].[ext]" },
]

export default defineConfig(async () => ({
  clearScreen: false,
  publicDir: "pack/public",
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
      ignored: ["srcpy/**", "_pyenv/**", "_internal/**"]
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
    minify: false,
    assetsInlineLimit: 0,
    outDir: "output/vite",
    rollupOptions: { 
      input: { 
        main: "main.html",
        splash: "splash.html"
      },
      output: {
        hashCharacters: "hex",

        entryFileNames: (info)=>{ return "in_[name].js" },
        chunkFileNames: (info)=>{ return "c_[name].js" },

        assetFileNames: (info)=>{
          const ext = info.name.split('.').pop()
          for(let e of assetFileSettings){
            if (e.ext.includes(ext.toLowerCase())) return e.path
          }
          return "other/[name].[ext]"
        }
      }
    },
  }
}))
