import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Plain object export — avoids `import { defineConfig } from 'vitest/config'`
// which requires vitest in local node_modules (we run via npx).
export default {
  // Use automatic JSX transform (React 17+) so files don't need `import React`
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    // Exclude Playwright e2e tests — run those with `pnpm test:e2e` instead
    exclude: ['node_modules/**', '__tests__/e2e/**', '**/*.e2e.*'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.test.*',
        '**/*.spec.*',
        'src/app/**/page.tsx',      // stub pages — not yet implemented
        'src/app/**/layout.tsx',    // route group layouts
        'src/app/**/loading.tsx',
        'src/app/**/not-found.tsx',
      ],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};
