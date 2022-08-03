import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/main.ts',
      name: 'CreativeOrangeAzureTextToSpeech',
      fileName: 'co-azure-tts',
    },
    outDir: 'dist',
    rollupOptions: {
      input: "./src/main.ts",
      output: {
        dir: "./dist",
      },
    }
  }
})
