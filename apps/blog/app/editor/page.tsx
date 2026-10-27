import { notFound } from 'next/navigation'
import { getAllEditorTags, isEditorEnabled, listEditorPosts, readEditorPost, type EditorPost } from '@/lib/editor'
import { PostEditor } from './PostEditor'

export const dynamic = 'force-dynamic'

/** @description 로컬 전용 포스트 에디터 (pnpm dev 에서만 접근 가능) */
export default async function EditorPage({ searchParams }: { searchParams: Promise<{ path?: string }> }) {
  if (!isEditorEnabled) {
    notFound()
  }

  const { path } = await searchParams
  const post = path ? readEditorPost(path) : createEmptyPost()

  if (!post) {
    notFound()
  }

  return (
    <PostEditor key={post.path ?? 'new'} initialPost={post} posts={listEditorPosts()} allTags={getAllEditorTags()} />
  )
}

function createEmptyPost(): EditorPost {
  // 로컬 타임존 기준 오늘 날짜 (YYYY-MM-DD)
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10)

  return {
    path: null,
    slug: '',
    date: today,
    title: '',
    description: '',
    tags: [],
    published: false,
    adminOnly: false,
    body: '',
  }
}
