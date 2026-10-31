import { Pagination } from '@/component/Pagination'
import { notFound } from 'next/navigation'
import { TypographyH1 } from '@common-ui'
import { PostCard } from '@/component/PostCard'
import { type Post } from '@/types/post'

const PAGE_SIZE = 5

interface FilteredPostsProps {
  // 관리자 접근 권한으로 필터링한 글만 전달받는다.
  allPosts: Post[]
  page?: string
  tag?: string
}

export const FilteredPosts = ({ allPosts, page, tag }: FilteredPostsProps) => {
  const currentPage = page === undefined ? 1 : Number(page)
  if (page !== undefined && (!/^\d+$/.test(page) || !Number.isSafeInteger(currentPage) || currentPage < 1)) {
    notFound()
  }

  const selectedTag = tag?.trim() || undefined
  const filteredPosts = selectedTag
    ? allPosts.filter((post) =>
        selectedTag === 'admin-only'
          ? post.frontMatter.adminOnly === true
          : post.frontMatter.tags.some((item) => item.trim() === selectedTag)
      )
    : allPosts
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE))
  if (currentPage > totalPages) notFound()

  const posts = filteredPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <>
      <TypographyH1 className="text-left">
        {selectedTag ? <span className="text-blue-600 dark:text-blue-400">#{selectedTag}</span> : 'Recent Posts'}
      </TypographyH1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{filteredPosts.length}개의 포스트</p>
      {posts.length ? (
        <ul className="mt-4 flex list-none flex-col gap-5">
          {posts.map((post) => (
            <PostCard post={post} key={post.slug} />
          ))}
        </ul>
      ) : (
        <p className="py-12 text-center text-gray-500">아직 등록된 포스트가 없습니다.</p>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} tag={selectedTag} />
    </>
  )
}
