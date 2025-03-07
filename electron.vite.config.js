import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'


const defaultConfig = {
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      copyPublicDir: true,
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
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`
        },
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
  }
}

export default defineConfig(() => {
  return defaultConfig
})
