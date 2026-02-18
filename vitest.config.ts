// Node Imports
import { resolve } from 'node:path'
// Thirdparty Imports
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/vitest.setup.ts'],
    include: ['projects/iamgld-ui-lib/src/lib/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'projects/iamgld-ui-lib/src/lib/utils/date/date.ts',
        'projects/iamgld-ui-lib/src/lib/services/authentication/authentication.service.ts',
      ],
      exclude: [
        'projects/iamgld-ui-lib/src/lib/**/*.spec.ts',
        'projects/iamgld-ui-lib/src/lib/**/index.ts',
        'projects/iamgld-ui-lib/src/lib/interceptors/**',
        'projects/iamgld-ui-lib/src/lib/directives/**',
        'projects/iamgld-ui-lib/src/lib/components/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 80,
        'projects/iamgld-ui-lib/src/lib/utils/date/date.ts': {
          lines: 100,
          functions: 100,
          statements: 100,
          branches: 100,
        },
        'projects/iamgld-ui-lib/src/lib/services/authentication/authentication.service.ts': {
          lines: 80,
          functions: 80,
          statements: 80,
          branches: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@environment': resolve(__dirname, 'src/environments/environment.local.ts'),
      '@shared': resolve(__dirname, 'src/app/shared'),
      '@app': resolve(__dirname, 'src/app/index.ts'),
    },
  },
})
