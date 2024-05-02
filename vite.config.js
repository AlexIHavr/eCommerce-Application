import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/eCommerce-Application/',
  plugins: [tsconfigPaths(), eslint()],
  build: {
    sourcemap: true,
  },
});
