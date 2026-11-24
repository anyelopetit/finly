import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { bcvRateDevPlugin } from './server/bcv-rate-dev.js'

export default defineConfig({
  plugins: [react(), bcvRateDevPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
    allowedHosts: true, // Allow Cloudflare Tunnel hostnames
  },
})
