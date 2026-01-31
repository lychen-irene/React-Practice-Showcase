import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.

  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.VITE_PROJECT_PATH,
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          // eslint-disable-next-line no-undef
          main: resolve(process.cwd(), 'index.html'),
          // eslint-disable-next-line no-undef
          about: resolve(process.cwd(), 'about.html'),
          // eslint-disable-next-line no-undef
          projectOne: resolve(process.cwd(), 'projectOne.html'),
          // eslint-disable-next-line no-undef
          projectTwo: resolve(process.cwd(), 'projectTwo.html'),
          // eslint-disable-next-line no-undef
          projectThree: resolve(process.cwd(), 'projectThree.html'),
          // eslint-disable-next-line no-undef
          projectFourth: resolve(process.cwd(), 'projectFourth.html'),
        },
      },
    },
  }
})
