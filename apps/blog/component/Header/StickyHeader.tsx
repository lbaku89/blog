'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  Button,
  TypographyH3,
  cn,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
} from '@common-ui'
import { Bars3Icon } from '@heroicons/react/24/outline'

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
        <Link href="/" className="flex justify-start items-center gap-2">
          <Image src="/avatar.webp" alt="권현우의 프로필 사진" width={40} height={40} className="rounded-full" />
          <TypographyH3 className="inline-block font-bold text-sm sm:text-base md:text-lg">HyunwooTech</TypographyH3>
        </Link>
        <div className="flex gap-2 items-center">
          <nav className="hidden gap-2 justify-between md:flex">
            <ul className="flex list-none gap-2">
              <li>
                <Button asChild variant="secondary">
                  <Link href="/">Post</Link>
                </Button>
              </li>
              <li>
                <Button asChild variant="secondary">
                  <Link href="/about">About</Link>
                </Button>
              </li>
            </ul>
          </nav>
          <div className="flex gap-2 items-center">
            <AdminAuthButton initialIsLoggedIn={initialIsLoggedIn} />
            <ThemeToggleBtn />
          </div>
          <div className="md:hidden">
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button size="icon" variant="secondary" aria-label="메뉴 열기">
                  <Bars3Icon className="w-5 h-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>메뉴</DrawerTitle>
                  <DrawerDescription>네비게이션 메뉴를 선택하세요.</DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-2 p-4">
                  <DrawerClose asChild>
                    <Button asChild variant="secondary" className="w-full justify-start">
                      <Link href="/">Post</Link>
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button asChild variant="secondary" className="w-full justify-start">
                      <Link href="/about">About</Link>
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>
    </div>
  )
}
