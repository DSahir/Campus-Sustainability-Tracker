/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    proxy: {
      // Proxy both auth and api calls to the FastAPI backend (Dhanshri's container)
      '/auth': { target: 'http://localhost:8000', changeOrigin: true },
      '/api':  { target: 'http://localhost:8000', changeOrigin: true },
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/tests/**', 'src/data/**', 'src/main.tsx'],
    },
  },
});