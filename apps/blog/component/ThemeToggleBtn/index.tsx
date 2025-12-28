'use client'

import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'

export const ThemeToggleBtn = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null)

  useEffect(() => {
    // 스크립트에서 이미 설정된 테마 상태를 읽어옴
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)
  }, [])

  const handleClickBtn = () => {
    const isDark = document.documentElement.classList.contains('dark')

    if (isDark) {
      // 다크 모드 → 라이트 모드
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDarkMode(false)
    } else {
      // 라이트 모드 → 다크 모드
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDarkMode(true)
    }
  }

  // 하이드레이션 완료 전까지는 렌더링하지 않음
  if (isDarkMode === null) {
    return null
  }

  return (
    <button onClick={handleClickBtn}>
      {isDarkMode ? (
        <MoonIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      ) : (
        <SunIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      )}
    </button>
  )
}
