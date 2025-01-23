import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import { resolve } from 'path'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'SUNCH_');
  return {
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    define: {
      'process.env': env
    },
    base: './',
    envPrefix: ['VITE_', 'SUNCH_'],
    plugins: [
      react(),
      electron({
        entry: [
          'electron/main.ts',
          'electron/preload.ts'
        ]
      }),
    ],
  };
});
