// Node Imports
import { resolve } from 'node:path'
// Thirdparty Imports
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['test/**/*.browser.spec.ts'],
    setupFiles: ['test/vitest.browser.setup.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: false,
      instances: [{ browser: 'chromium' }],
    },
  },
  resolve: {
    alias: {
      '@environment': resolve(__dirname, 'src/environments/environment.local.ts'),
      '@shared': resolve(__dirname, 'src/app/shared'),
      '@app': resolve(__dirname, 'src/app/index.ts'),
      '@packageJson': resolve(__dirname, 'package.json'),
    },
  },
})
