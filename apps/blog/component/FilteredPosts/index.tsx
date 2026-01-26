'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { InfiniteScrollPosts } from '@/component/InfiniteScrollPosts'
import { ProfileSection } from '@/component/ProfileSection'
import { TypographyH1 } from '@common-ui'
import { type Post } from '@/types/post'

interface FilteredPostsProps {
  allPosts: Post[]
}

export const FilteredPosts = ({ allPosts }: FilteredPostsProps) => {
  const searchParams = useSearchParams()
  const tag = searchParams.get('tag')

  // 태그로 필터링
  const filteredPosts = useMemo(() => {
    return tag ? allPosts.filter((post) => post.frontMatter.tags.some((t) => t.trim() === tag.trim())) : allPosts
  }, [allPosts, tag])

  // 초기 5개만 로드
  const initialPosts = useMemo(() => filteredPosts.slice(0, 5), [filteredPosts])
  const hasMore = filteredPosts.length > 5

  return (
    <>
      {!tag && <ProfileSection />}
      <TypographyH1 className="text-left">
        {tag ? <span className="text-blue-600 dark:text-blue-400">#{tag}</span> : 'Recent Posts'}
      </TypographyH1>
      {tag && <p className="mt-2 text-gray-600 dark:text-gray-400">{filteredPosts.length}개의 포스트</p>}
      <InfiniteScrollPosts
        key={tag || 'all'}
        initialPosts={initialPosts}
        initialHasMore={hasMore}
        tag={tag || undefined}
      />
    </>
  )
}
