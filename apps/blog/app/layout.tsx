import type { Metadata } from 'next'
import localFont from 'next/font/local'
// shadcn CSS 변수 import (packages/ui에서 재사용)
import '@common-ui/src/styles/variables.css'
import './globals.css'
import { Footer } from '@/component/Footer'
import { Header } from '@/component/Header'
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 200 300 400 500 600 700 800 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 200 300 400 500 600 700 800 900',
})

export const metadata: Metadata = {
  title: "Hyunwoo' Blog",
  description: 'Frontend 개발, Next.js, React, 그리고 기술 성장 이야기',
  keywords: ['Next.js', 'React', 'Frontend', '기술 블로그', 'Hyunwoo'],
  authors: [{ name: 'Hyunwoo Kwon', url: 'https://kwonhyunwoo.dev' }],
  creator: 'Hyunwoo',
  metadataBase: new URL('https://kwonhyunwoo.dev'),
  openGraph: {
    title: 'Hyunwoo Dev Blog',
    description: '프론트엔드 개발자의 기술 블로그',
    url: 'https://kwonhyunwoo.dev',
    siteName: 'Hyunwoo Dev Blog',
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hyunwoo Blog OpenGraph Image',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="bg-white dark:bg-[#121212]">
      <head>
        {/* google analytics setting */}
        <meta name="google-site-verification" content="GoOy_S38H-PIOfcU58pJ0js6_b44FEC5-3PzUri-IXI" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark')
                    localStorage.setItem('theme', 'dark')
                  } else {
                    document.documentElement.classList.remove('dark')
                    localStorage.setItem('theme', 'light')
                  }
                } catch (_) {}
              })()
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <div
          className={`${geistSans.variable} ${geistMono.variable} antialiased w-full max-w-full mx-auto px-4 flex-1`}
        >
          <Header />
          <div className="py-[30px] flex-1">{children}</div>
        </div>
        <Footer />
      </body>
    </html>
  )
}
