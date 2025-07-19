import { POSTS_PER_PAGE } from '../../constants/post'
import Link from 'next/link'
import {
  ChevronLeftIcon,
  ChevronDoubleLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid'
import { cn } from '@/utils/tailwind'

export const Pagination = ({ currentPage, totalPages }: { currentPage: number; totalPages: number }) => {
  const PAGINATION_UNIT = 5 // 한 사이클에 보여줄 페이지 수

  const startPage = Math.floor((currentPage - 1) / PAGINATION_UNIT) * POSTS_PER_PAGE + 1

  const pageArr = Array(PAGINATION_UNIT)
    .fill(0)
    .map((_, index) => {
      const page = startPage + index
      return page <= totalPages ? page : null
    })
    .filter((page) => page !== null)

  const STYLE =
    'bg-gray-100 size-[35px] dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200'

  return (
    <nav>
      <ul className="pagination flex gap-2 justify-center mt-4 list-none items-center">
        <li>
          <Link href={`/pages/1`} className={cn(STYLE)}>
            <ChevronDoubleLeftIcon className="size-[15px]" />
          </Link>
        </li>
        <li>
          <Link href={`/pages/${currentPage - 1 || 1}`} className={cn(STYLE)}>
            <ChevronLeftIcon className="size-[15px]" />
          </Link>
        </li>

        {pageArr.map((page) => (
          <li key={page}>
            <Link href={`/pages/${page}`} className={cn(STYLE, currentPage === Number(page) && '!text-blue-400')}>
              {page}
            </Link>
          </li>
        ))}

        <li>
          <Link href={`/pages/${Math.min(currentPage + 1, totalPages)}`} className={STYLE}>
            <ChevronRightIcon className="size-[15px]" />
          </Link>
        </li>
        <li>
          <Link href={`/pages/${totalPages}`} className={STYLE}>
            <ChevronDoubleRightIcon className="size-[15px]" />
          </Link>
        </li>
      </ul>
    </nav>
  )
}
