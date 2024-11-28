import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// Vite configuration
export default defineConfig({
  plugins: [
    react(), // React plugin to support JSX and React Fast Refresh
    svgr(),  // SVGR plugin to enable SVG imports as React components
  ],
  build: {
    outDir: 'dist',      // Output directory for build
    assetsDir: 'assets', // Directory inside `outDir` for assets like images, fonts, etc.
  },
});
