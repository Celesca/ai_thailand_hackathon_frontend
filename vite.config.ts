import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Proxy API requests to avoid CORS issues in development
      '/api': {
        target: 'https://api.hackathon2025.ai.in.th/team06-1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
        ws: true,
      }
    },
    cors: {
      origin: true,
      credentials: true,
    }
  }
})