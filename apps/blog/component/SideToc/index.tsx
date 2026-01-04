'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  tocHtml: string
}

export function SideToc({ tocHtml }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const tocRef = useRef<HTMLDivElement | null>(null)

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
         * - 화면 위쪽 40%
         * - 화면 아래쪽 50%
         * 을 제외한 ‘가운데 영역’에서만 감지되도록 조정 가능
         *
         * 즉, heading이 화면 중앙 부근에 왔을 때 active 처리됨
         */ rootMargin: '-40% 0px -50% 0px',
        /**
         * threshold
         * 0 = 요소의 일부라도 걸쳐있으면 intersect true
         *
         * rootMargin과 조합해서 "중앙 근처에서만 true"가 되도록 설정
         */
        threshold: 0,
      }
    )

    headings.forEach((h) => observer.observe(h))

    return () => observer.disconnect()
  }, [])

  // 2) activeId 바뀔 때마다 TOC DOM에 클래스 토글
  useEffect(() => {
    if (!tocRef.current) return
    const links = Array.from(tocRef.current.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))

    links.forEach((link) => {
      const hrefId = link.getAttribute('href')?.slice(1) // "#id" -> "id"
      if (!hrefId) return

      if (hrefId === activeId) {
        link.classList.add('text-blue-500', 'font-semibold')
        link.classList.remove('text-neutral-400')
      } else {
        link.classList.remove('text-blue-500', 'font-semibold')
        link.classList.add('text-neutral-400')
      }
    })
  }, [activeId])

  return (
    <aside className="xl:absolute w-64 shrink-0 top-0 left-[100%] h-full">
      <div className="sticky top-[150px] p-6">
        <p className="text-sm font-medium text-gray-900 dark:text-neutral-400 mb-2">목차</p>
        <div
          ref={tocRef}
          className="text-neutral-400 p-2 text-xs leading-snug space-y-1"
          dangerouslySetInnerHTML={{ __html: tocHtml }}
        />
      </div>
    </aside>
  )
}
