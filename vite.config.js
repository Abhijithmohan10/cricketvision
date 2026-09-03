import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Must match the GitHub Pages repo name for correct asset paths
  base: '/cricketvision/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});
