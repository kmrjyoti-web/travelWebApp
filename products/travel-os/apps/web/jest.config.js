/** @type {import('vitest').UserConfig} */
const config = {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test-setup.ts', '**/*.d.ts', '**/*.config.*'],
    },
  },
};

module.exports = config;
