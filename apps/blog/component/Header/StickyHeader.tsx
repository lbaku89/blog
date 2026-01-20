'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Button, TypographyH3, cn } from '@common-ui'

import { AdminAuthButton } from '../AdminAuthButton'
import { ThemeToggleBtn } from '../ThemeToggleBtn'

type StickyHeaderProps = {
  initialIsLoggedIn: boolean
}

export const StickyHeader = ({ initialIsLoggedIn }: StickyHeaderProps) => {
  const [isHidden, setIsHidden] = useState(false)
  const [hasShadow, setHasShadow] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const isScrollingDown = currentY > lastScrollY.current

      if (isScrollingDown && currentY > 80) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }

      setHasShadow(currentY > 0)

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={cn(
        'sticky top-0 z-50 bg-transparent backdrop-blur-sm transition-transform duration-200 ease-in-out',
        hasShadow && 'border-b shadow-sm border-black/5 dark:border-white/10',
        isHidden ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <header className="flex justify-between items-center bg-transparent mx-auto max-w-[1200px] px-4 py-3">
        <Link href="/" className="flex justify-start  items-center gap-2">
          <Image src="/avatar.webp" alt="권현우의 프로필 사진" width={40} height={40} className="rounded-full" />
          <TypographyH3 className="inline-block text-[16px]">Hyunwoo</TypographyH3>
        </Link>
        <div className="flex gap-4 items-center">
          <nav className="flex gap-4 justify-between">
            <ul className="flex list-none">
              <li>
                <Button asChild variant="link">
                  <Link href="/">Post</Link>
                </Button>
              </li>
              <li>
                <Button asChild variant="link">
                  <Link href="/about">About</Link>
                </Button>
              </li>
            </ul>
          </nav>
          <AdminAuthButton initialIsLoggedIn={initialIsLoggedIn} />
          <ThemeToggleBtn />
        </div>
      </header>
    </div>
  )
}

