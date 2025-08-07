import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    ui: true,
  },
  server: {
    host: true,
    port: 51204,
  },
});
