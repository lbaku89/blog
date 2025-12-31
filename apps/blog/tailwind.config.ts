import type { Config } from 'tailwindcss'
import tailwindcssAnimated from 'tailwindcss-animated'
import typography from '@tailwindcss/typography'
import { shadcnTheme } from '@common-ui/tailwind.config'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './component/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './posts/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@common-ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [tailwindcssAnimated, typography],
  theme: {
    extend: {
      // shadcn 테마를 import하여 재사용
      ...shadcnTheme,
      // 필요시 추가 커스텀 설정 가능
      // colors: {
      //   ...shadcnTheme.colors,
      //   custom: '...',
      // },
    },
  },
}
export default config
