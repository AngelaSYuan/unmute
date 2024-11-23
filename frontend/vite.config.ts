import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg'], // Add this line to exclude FFmpeg from optimization
  },
  server: {
    port: 8000
  }
})
