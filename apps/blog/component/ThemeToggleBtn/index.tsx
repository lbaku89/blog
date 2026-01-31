'use client'

import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import { useThemeStore } from '@/store/theme'
import { Button } from '@common-ui/'
import { useEffect, useState } from 'react'

export const ThemeToggleBtn = () => {
  const { theme, toggleTheme } = useThemeStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClickBtn = () => {
    toggleTheme()
  }

  // 서버와 클라이언트 간 hydration mismatch를 방지하기 위해
  // 마운트되기 전까지는 기본 아이콘만 렌더링
  if (!mounted) {
    return (
      <Button onClick={handleClickBtn} variant="secondary" size="icon">
        <SunIcon />
      </Button>
    )
  }

  return (
    <Button onClick={handleClickBtn} variant="secondary" size="icon">
      {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
    </Button>
  )
}
