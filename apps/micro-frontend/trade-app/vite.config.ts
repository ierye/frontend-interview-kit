import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/trade/',
  server: {
    port: 9002,
  },
  plugins: [react(), federation({
    name: '@mf/trade',
      exposes: {
        '.': './src/mod.ts',
      },
      shared: ['react','react-dom'],
      manifest: {
        filePath: 'assets',
      },
  })],
})
