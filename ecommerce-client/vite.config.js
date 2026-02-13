// vite.config.js (or vite.config.ts if using TypeScript)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Add this line – fixes most white/blank screen on refresh issues
  base: '/',  // Use '/' for root deployments on Vercel (default is good)

  plugins: [
    react(),
    tailwindcss(),
  ],

  // Optional: If you still see asset path issues after refresh, try this instead:
  // base: './',  // relative paths (test both; '/' usually wins on Vercel)
})