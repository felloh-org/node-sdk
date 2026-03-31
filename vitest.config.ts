import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    restoreMocks: true,
    exclude: ['tests/integration/**', 'node_modules/**'],
  },
});
