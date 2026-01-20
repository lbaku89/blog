'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { PostCard } from '@/component/PostCard'
import { type Post } from '@/types/post'

interface InfiniteScrollPostsProps {
  initialPosts: Post[]
  initialHasMore?: boolean
  tag?: string
}

export const InfiniteScrollPosts = ({ initialPosts, initialHasMore = true, tag }: InfiniteScrollPostsProps) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)

  const loadMorePosts = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const nextPage = page + 1
      const tagParam = tag ? `&tag=${encodeURIComponent(tag)}` : ''
      const response = await fetch(`/api/posts?page=${nextPage}&limit=5${tagParam}`)
      const data = await response.json()

      if (data.posts && data.posts.length > 0) {
        // Date 문자열을 Date 객체로 변환
        const newPosts: Post[] = data.posts.map((post: Post) => ({
          ...post,
          frontMatter: {
            ...post.frontMatter,
            date: new Date(post.frontMatter.date),
          },
        }))

        setPosts((prev) => [...prev, ...newPosts])
        setPage(nextPage)
        setHasMore(data.hasMore)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Failed to load more posts:', error)
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }, [page, isLoading, tag])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMorePosts()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, isLoading, loadMorePosts])

  return (
    <>
      <ul className="list-none list-inside mt-4 flex flex-col gap-5">
        {posts.map((post) => {
          return <PostCard post={post} key={post.slug} />
        })}
      </ul>
      {hasMore && (
        <div ref={observerTarget} className="h-10 flex items-center justify-center">
          {isLoading && <p className="text-gray-500 dark:text-gray-400">로딩 중...</p>}
        </div>
      )}
    </>
  )
}
