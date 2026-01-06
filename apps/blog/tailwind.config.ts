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

    // 모노레포 이므로 '@common-ui' 패키지 원본을 감지하도록 변경 (node_modules 로 할 경우 성능상 이슈 발생)
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
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
