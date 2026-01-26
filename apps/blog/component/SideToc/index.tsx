'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  tocHtml: string
}

export function SideToc({ tocHtml }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const tocRef = useRef<HTMLDivElement | null>(null)
  const indicatorRef = useRef<HTMLDivElement | null>(null)

  // 1) 헤딩들 관찰해서 activeId 갱신
  useEffect(() => {
    /**
     * 현재 문서 내에서 id 속성이 있는 heading 요소들을 모두 수집
     * → TOC와 연결되는 대상은 보통 h2~h6이므로 해당 selector 사용
     */
    const headings = Array.from(document.querySelectorAll<HTMLElement>('h2[id], h3[id], h4[id] , h5[id] , h6[id]'))

    if (!headings.length) return

    /**
     * IntersectionObserver
     *
     * 스크롤 시 특정 요소(heading)가 뷰포트 영역에 들어오는지 감지하는 API
     * 여기서는 "현재 화면에 보이는 heading"을 찾아서
     * active TOC 항목을 업데이트하는 용도로 사용
     */
    const observer = new IntersectionObserver(
      (entries) => {
        /**
         * entries = 관찰 대상 heading 목록
         *
         * 각 heading이 화면에 보이는 순간(entry.isIntersecting === true)
         * 해당 heading의 id를 activeId로 저장
         */ entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        /**
         * rootMargin
         *
         * 기본적으로 IntersectionObserver는
         * "뷰포트 전체"를 기준으로 intersect 여부를 계산하지만
         *
         * 아래처럼 margin을 적용하면
         * - 화면 위쪽 150px (scroll-margin-top과 동일)
         * - 화면 아래쪽 70%
         * 을 제외한 영역에서 감지되도록 조정
         *
         * 목차 링크 클릭 시 헤딩이 상단 150px 아래로 이동하므로,
         * 그 위치를 기준으로 active 상태를 판단
         * 하단 마진을 크게 설정하여 헤딩이 상단 근처에 있을 때만 active 처리
         *
         * xl 브레이크포인트 이상에서만 표시되므로 작은 화면 고려 불필요
         */ rootMargin: '-150px 0px -70% 0px',
        /**
         * threshold
         * 0 = 요소의 일부라도 걸쳐있으면 intersect true
         */
        threshold: 0,
      }
    )

    headings.forEach((h) => observer.observe(h))

    return () => observer.disconnect()
  }, [])

  // 2) activeId 바뀔 때마다 TOC DOM에 클래스 토글 및 바 위치 업데이트
  useEffect(() => {
    if (!tocRef.current || !indicatorRef.current) return
    const links = Array.from(tocRef.current.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))

    let activeListItem: HTMLLIElement | null = null

    links.forEach((link) => {
      const hrefId = link.getAttribute('href')?.slice(1) // "#id" -> "id"
      if (!hrefId) return

      const listItem = link.closest('li') as HTMLLIElement | null
      if (listItem) {
        if (hrefId === activeId) {
          link.classList.add('text-blue-500', 'font-semibold')
          link.classList.remove('text-neutral-400')
          activeListItem = listItem
        } else {
          link.classList.remove('text-blue-500', 'font-semibold')
          link.classList.add('text-neutral-400')
        }
      }
    })

    // 바 위치 업데이트 (수직으로만 이동)
    const tocContainer = tocRef.current
    if (activeListItem && indicatorRef.current && tocContainer) {
      const itemTop = (activeListItem as HTMLLIElement).offsetTop - tocContainer.offsetTop
      const itemHeight = (activeListItem as HTMLLIElement).offsetHeight

      indicatorRef.current.style.transform = `translateY(${itemTop}px)`
      indicatorRef.current.style.height = `${itemHeight}px`
      indicatorRef.current.style.opacity = '1'
    } else if (indicatorRef.current) {
      indicatorRef.current.style.opacity = '0'
    }
  }, [activeId])

  return (
    <aside className="hidden xl:block xl:absolute w-64 shrink-0 top-0 left-[100%] h-full">
      <div className="sticky top-[150px] p-6">
        <p className="text-sm font-medium text-gray-900 dark:text-neutral-400 mb-2">목차</p>
        <div className="relative">
          <div
            ref={indicatorRef}
            className="absolute left-0 w-0.5 bg-blue-400 dark:bg-blue-500 opacity-0 transition-all duration-300 ease-in-out"
            style={{ transform: 'translateY(0px)', height: '0px' }}
          />
          <div
            ref={tocRef}
            className="text-neutral-400 p-2 text-xs leading-snug space-y-1 relative"
            dangerouslySetInnerHTML={{ __html: tocHtml }}
          />
        </div>
      </div>
    </aside>
  )
}
