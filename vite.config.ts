import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Browser QA profiles contain locked databases and are not application sources.
  server: { watch: { ignored: ['**/.qa/**'] } },
})
