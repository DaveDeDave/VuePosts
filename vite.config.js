import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/vite-plugin-vue-i18n';

export default defineConfig({
  plugins: [
    vue(),
    vueI18n({
      include: path.resolve('src/locales/**'),
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target:'http://localhost:3231',
        changeOrigin: true,
      }
    }
  },
  publicDir: "src/assets"
});