import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Multi-page build: preserve EVERY original route and its original HTML.
const pages = ['index.html','404.html','sobre/index.html','portfolio/index.html',
'contato/index.html','privacidade/index.html',
'projeto/terraco-e-piscina/index.html',
'projeto/cozinha-e-convivencia/index.html',
'projeto/materialidade-e-texturas/index.html',
'projeto/olhar-sobre-o-espaco/index.html'];
export default defineConfig({
    publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: { input: Object.fromEntries(pages.map(p => [p.replaceAll('/','_'),resolve(process.cwd(),p)])) }
  }
});
