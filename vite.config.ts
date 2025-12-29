import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // 🔥 GitHub Pages এর জন্য MUST
  base: '/foodiExpress/',   // 👈 repo name (exact same)

  server: {
    port: 5173,      // default port
    open: true,      // auto open browser
    host: true,      // accessible in network
  },

  build: {
    outDir: 'dist',
  },

  resolve: {
    alias: {
      '@': '/src',   // optional shortcut import
    },
  },
})
