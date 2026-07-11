import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  port: 5173,
  strictPort: true,
  allowedHosts: true,
  cors: true,
  headers: {
      'X-Content-Type-Options': 'nosniff',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
