'use client'

import Giscus from '@giscus/react'
import { useThemeStore } from '@/store/theme'

export const PostComments = () => {
  const { theme } = useThemeStore()

  return (
    <Giscus
      id="comments"
      repo="lbaku89/blog-comments"
      repoId="R_kgDOQxedGQ"
      category="General"
      categoryId="DIC_kwDOQxedGc4C0art"
      mapping="pathname" // ← 페이지 URL 기준 매핑
      reactionsEnabled="1" // ← 👍 등 리액션 활성화
      emitMetadata="0" // ← 메타데이터 숨김
      inputPosition="bottom"
      theme={theme}
      lang="ko"
      loading="lazy"
    />
  )
}
