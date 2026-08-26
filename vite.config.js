import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  preview: {
    headers: {
      // Required for iOS Universal Links verification
      'Content-Type': 'application/json',
    },
  },
});
