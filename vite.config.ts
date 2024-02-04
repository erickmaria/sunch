import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'SUNCH_');
  return {
      define: {
        'process.env': env
      },
      base: './',
      envPrefix: 'SUNCH_',
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
