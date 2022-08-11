import { defineConfig } from 'vite';
import path from 'path';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    eslint({
      fix: true
    })
  ],
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
