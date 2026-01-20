'use client'

import { useEffect, useState } from 'react'
import { ArrowUpIcon } from '@heroicons/react/24/solid'
import { Button } from '@common-ui'

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // 스크롤이 300px 이상 내려가면 버튼 표시
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className="fixed bottom-8 right-8 z-50 rounded-full shadow-lg hover:shadow-xl transition-all"
      aria-label="맨 위로 가기"
    >
      <ArrowUpIcon className="size-5" />
    </Button>
  )
}
