import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

const defaultConfig = {
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: './electron/main.js'
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: './electron/preload.js'
      }
    }
  },
  renderer: {
    appType: 'mpa',
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/renderer/index.html')
        }
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer')
      }
    },
    plugins: [react()]
  }
}

export default defineConfig(() => {
  return defaultConfig
})
