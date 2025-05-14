// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      SUPABASE_URL: JSON.stringify(process.env.SUPABASE_URL),
      SUPABASE_ANON_KEY: JSON.stringify(process.env.SUPABASE_ANON_KEY),
    },
  },
})
