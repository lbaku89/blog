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

// 루트에서 eslint 실행 시(lefthook 등) 이 설정 적용
export default baseConfig()
