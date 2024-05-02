import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  base: '/eCommerce-Application/',
  plugins: [eslint()],
  build: {
    sourcemap: true,
  },
});
