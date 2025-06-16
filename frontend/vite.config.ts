import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3011,
  },
  preview: {
    port: 3011,
    host: true
  }
}); 