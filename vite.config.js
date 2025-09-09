import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        qr: resolve(__dirname, 'qr/index.html'),
        shortener: resolve(__dirname, 'shortener/index.html'),
        wifi: resolve(__dirname, 'qr/wifi/index.html'),
        vcard: resolve(__dirname, 'qr/vcard/index.html'),
        event: resolve(__dirname, 'qr/event/index.html')
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  server: {
    port: 5173,
    open: true
  },
  css: {
    postcss: './postcss.config.js'
  },
  base: '/'
})
