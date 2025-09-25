import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Medi-Assist1/',
  server: {
    port: 5173,
    host: 'localhost',
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})