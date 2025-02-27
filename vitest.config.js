import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    include: ['**/*.test.{js,jsx}'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/']
    }
  }
}); 