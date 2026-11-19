import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Peer-to-Peer-Book-Exchange/', // <-- Your EXACT GitHub repository name
});