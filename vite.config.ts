import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',            // ensures all asset URLs start with "/"
  plugins: [react()],
  build: {
    outDir: 'dist',      // where Vite writes the production build
    assetsDir: 'assets', // subfolder for JS/CSS/images
    sourcemap: false     // optional, omit if you don’t need source maps
  }
})