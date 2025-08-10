import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    reporters: ['default', 'html'],
    environment: 'node',
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    setupFiles: ['src/tests/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@tests': resolve(__dirname, './tests'),
    },
  },
});
