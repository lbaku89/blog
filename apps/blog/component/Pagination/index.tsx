import Link from 'next/link'
import {
  ChevronLeftIcon,
  ChevronDoubleLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid'
import { cn } from '@/utils/tailwind'

interface PaginationProps {
  currentPage: number
  totalPages: number
  tag?: string
}

export const Pagination = ({ currentPage, totalPages, tag }: PaginationProps) => {
  if (totalPages <= 1) return null

  const PAGINATION_UNIT = 5
  // 페이지 묶음은 글 개수가 아니라 한 번에 표시할 페이지 수를 기준으로 계산한다.
  const startPage = Math.floor((currentPage - 1) / PAGINATION_UNIT) * PAGINATION_UNIT + 1
  const pages = Array.from({ length: Math.min(PAGINATION_UNIT, totalPages - startPage + 1) }, (_, i) => startPage + i)
  const pageHref = (page: number) => {
    const params = new URLSearchParams()
    if (tag) params.set('tag', tag)
    if (page > 1) params.set('page', String(page))
    return params.size ? `/?${params}` : '/'
  }
  const style =
    'bg-gray-100 size-10 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2'
  const controls = [
    { label: '첫 페이지', page: 1, Icon: ChevronDoubleLeftIcon, disabled: currentPage === 1 },
    { label: '이전 페이지', page: currentPage - 1, Icon: ChevronLeftIcon, disabled: currentPage === 1, rel: 'prev' },
    {
      label: '다음 페이지',
      page: currentPage + 1,
      Icon: ChevronRightIcon,
      disabled: currentPage === totalPages,
      rel: 'next',
    },
    { label: '마지막 페이지', page: totalPages, Icon: ChevronDoubleRightIcon, disabled: currentPage === totalPages },
  ]
  const renderControl = ({ label, page, Icon, disabled, rel }: (typeof controls)[number]) => (
    <li key={label}>
      {disabled ? (
        <span aria-label={label} aria-disabled="true" className={cn(style, 'pointer-events-none opacity-40')}>
          <Icon className="size-[15px]" aria-hidden="true" />
        </span>
      ) : (
        <Link href={pageHref(page)} aria-label={label} rel={rel} className={style}>
          <Icon className="size-[15px]" aria-hidden="true" />
        </Link>
      )}
    </li>
  )

  return (
    <nav aria-label="포스트 페이지" className="mt-8">
      <ul className="pagination flex list-none flex-wrap items-center justify-center gap-2">
        {controls.slice(0, 2).map(renderControl)}
        {pages.map((page) => (
          <li key={page}>
            {page === currentPage ? (
              <span
                aria-current="page"
                aria-label={`${page}페이지, 현재 페이지`}
                className={cn(style, 'text-blue-600! font-semibold dark:text-blue-400!')}
              >
                {page}
              </span>
            ) : (
              <Link href={pageHref(page)} aria-label={`${page}페이지`} className={style}>
                {page}
              </Link>
            )}
          </li>
        ))}
        {controls.slice(2).map(renderControl)}
      </ul>
    </nav>
  )
}
