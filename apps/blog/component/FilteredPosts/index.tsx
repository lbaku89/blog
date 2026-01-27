'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { InfiniteScrollPosts } from '@/component/InfiniteScrollPosts'
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
    if (!tag) return allPosts
    
    const trimmedTag = tag.trim()
    
    // "admin-only" 태그는 admin 전용 포스팅을 필터링
    if (trimmedTag === 'admin-only') {
      return allPosts.filter((post) => post.frontMatter.adminOnly === true)
    }
    
    // admin 권한이 있는지 확인 (allPosts에 admin 전용 포스팅이 포함되어 있으면 admin 권한이 있음)
    const hasAdminAccess = allPosts.some((post) => post.frontMatter.adminOnly)
    
    // 일반 태그는 실제 태그 배열에서 찾기
    return allPosts.filter((post) => {
      // admin 권한이 있으면 admin 전용 포스팅도 포함, 없으면 제외
      if (post.frontMatter.adminOnly && !hasAdminAccess) {
        return false
      }
      return post.frontMatter.tags.some((tag) => tag.trim() === trimmedTag)
    })
  }, [allPosts, tag])

  // 초기 5개만 로드
  const initialPosts = useMemo(() => filteredPosts.slice(0, 5), [filteredPosts])
  const hasMore = filteredPosts.length > 5

  return (
    <>
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
