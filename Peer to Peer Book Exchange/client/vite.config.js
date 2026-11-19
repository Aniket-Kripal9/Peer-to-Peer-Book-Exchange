import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Replace with your EXACT repository name
  base: '/Peer-to-Peer-Book-Exchange/', 
})