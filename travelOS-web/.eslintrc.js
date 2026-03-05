module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@coreui/react', '@coreui/react-pro', '@coreui/icons-react'],
            message: 'Import CoreUI components from @/shared/components instead.',
          },
          {
            group: ['lucide-react'],
            message: 'Use <Icon name="..." /> from @/shared/components instead.',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      // Allow direct CoreUI + lucide-react imports ONLY in shared/components/
      files: [
        'src/shared/components/**/*.tsx',
        'src/shared/components/**/*.ts',
      ],
      rules: { 'no-restricted-imports': 'off' },
    },
    {
      // Allow direct lucide-react imports in UIKitMain-migrated features
      files: [
        'src/features/layout/**/*.tsx',
        'src/features/theme/**/*.tsx',
        'src/features/dashboard/components/ItineraryDashboard.tsx',
        'src/features/dashboard/components/ItineraryHeader.tsx',
        'src/features/dashboard/components/DashboardWidgets.tsx',
        'src/features/auth/login/**/*.tsx',
      ],
      rules: {
        'no-restricted-imports': 'off',
        'react/no-unescaped-entities': 'off',
      },
    },
  ],
};
