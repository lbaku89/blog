import { create } from 'zustand'

type Theme = 'dark' | 'light'

export const useThemeStore = create<{
  theme: Theme
  toggleTheme: () => void
}>((set) => {
  // 초기값을 localStorage에서 가져오기
  const initialTheme = typeof window !== 'undefined' && localStorage.theme === 'dark' ? 'dark' : 'light'

  return {
    theme: initialTheme,
    toggleTheme: () =>
      set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark'
        // localStorage도 업데이트
        if (typeof window !== 'undefined') {
          localStorage.theme = newTheme
          document.documentElement.classList.toggle('dark', newTheme === 'dark')
        }
        return { theme: newTheme }
      }),
  }
})
