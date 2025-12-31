'use client'

import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import { useThemeStore } from '@/store/theme'
export const ThemeToggleBtn = () => {
  const { theme, toggleTheme } = useThemeStore()

  const handleClickBtn = () => {
    toggleTheme()
  }

  return (
    <button onClick={handleClickBtn}>
      {theme === 'dark' ? (
        <MoonIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      ) : (
        <SunIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      )}
    </button>
  )
}
