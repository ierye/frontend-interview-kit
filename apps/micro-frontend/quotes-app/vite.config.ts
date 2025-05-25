import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/quotes/',
  server: {
    port: 9001,
  },
  plugins: [react(), federation({
    name: '@mf/quotes',
      exposes: {
        '.': './src/mod.ts',
      },
      shared: ['react', 'react-dom'],
      manifest: {
        filePath: 'assets',
      },
  })],
})
