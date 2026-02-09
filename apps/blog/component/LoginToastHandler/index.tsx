'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

export const LoginToastHandler = () => {
  useEffect(() => {
    // Toaster가 준비될 때까지 약간 지연
    const timer = setTimeout(() => {
      // 새로고침 후 로그인 toast 표시
      const showLoginToast = sessionStorage.getItem('showLoginToast')
      if (showLoginToast === 'true') {
        toast.success('현우님 환영합니다!', {
          position: 'bottom-center',
        })
        sessionStorage.removeItem('showLoginToast')
      }

      // 새로고침 후 로그아웃 toast 표시
      const showLogoutToast = sessionStorage.getItem('showLogoutToast')
      if (showLogoutToast === 'true') {
        toast.success('로그아웃되었습니다.', {
          position: 'bottom-center',
        })
        sessionStorage.removeItem('showLogoutToast')
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return null
}
