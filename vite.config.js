import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/eCommerce-Application/',
  plugins: [
    tsconfigPaths(),
    checker({ typescript: true, eslint: { lintCommand: 'eslint ./src' } }),
  ],
  build: {
    sourcemap: true,
  },
});
