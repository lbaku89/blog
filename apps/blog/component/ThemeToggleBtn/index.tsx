'use client'

import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import { useThemeStore } from '@/store/theme'
import { Button } from '@common-ui/'
export const ThemeToggleBtn = () => {
  const { theme, toggleTheme } = useThemeStore()

  const handleClickBtn = () => {
    toggleTheme()
  }

  return (
    <Button onClick={handleClickBtn} variant="outline" size="icon">
      {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
    </Button>
  )
}
