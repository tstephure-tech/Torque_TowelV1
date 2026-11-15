import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

function copyStaticScripts() {
  return {
    name: 'copy-static-scripts',
    closeBundle() {
      const srcDir = path.resolve('js');
      const outDir = path.resolve('dist/js');
      if (!fs.existsSync(srcDir)) return;
      fs.mkdirSync(outDir, { recursive: true });
      for (const file of fs.readdirSync(srcDir)) {
        fs.copyFileSync(path.join(srcDir, file), path.join(outDir, file));
      }
    },
  };
}

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    hmr: false,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve('index.html'),
        menu: path.resolve('menu.html'),
        book: path.resolve('book.html'),
      },
    },
  },
  plugins: [copyStaticScripts()],
});
