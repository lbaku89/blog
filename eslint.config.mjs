import { defineConfig, globalIgnores } from 'eslint/config'

export function baseConfig() {
  return defineConfig([
    globalIgnores(['**/dist/**', '**/.turbo/**', '**/node_modules/**']),
    {
      rules: {
        'no-unused-vars': 'warn',
        'no-console': 'warn',
      },
    },
  ])
}
