/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['next/core-web-vitals'],
  overrides: [
    {
      // icons.ts IS the central registry — the one file allowed to import lucide-react directly.
      files: ['src/components/icons/icons.ts'],
      rules: { 'no-restricted-imports': 'off' },
    },
  ],
  rules: {
    // Enforce shared/ folder pattern — no direct CoreUI or lucide imports in features
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@coreui/*'],
            message: 'Import CoreUI via @/components/* wrappers only.',
          },
          {
            group: ['lucide-react'],
            message: 'Use <Icon name="..." /> from @/components/icons/Icon instead.',
          },
        ],
      },
    ],
  },
};
