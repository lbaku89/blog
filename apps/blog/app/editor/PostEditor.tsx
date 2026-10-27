'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { toast } from 'sonner'
import { CalendarIcon } from '@heroicons/react/24/solid'
import { Badge, Button } from '@common-ui'
import type { EditorPost, EditorPostSummary } from '@/lib/editor'

// MDXEditor는 브라우저 API에 의존하므로 클라이언트에서만 렌더링
const MdxEditor = dynamic(() => import('./MdxEditor').then((mod) => mod.MdxEditor), {
  ssr: false,
  loading: () => <p className="pt-[30px] text-gray-400">에디터 불러오는 중...</p>,
})

/** @example 'My First Post!' → 'my-first-post' */
function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w()-]/g, '')
}

interface PostEditorProps {
  initialPost: EditorPost
  posts: EditorPostSummary[]
  allTags: string[]
}

export const PostEditor = ({ initialPost, posts, allTags }: PostEditorProps) => {
  const router = useRouter()
  const [post, setPost] = useState(initialPost)
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(initialPost))
  const [tagInput, setTagInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const savingRef = useRef(false)

  const isDirty = JSON.stringify(post) !== savedSnapshot

  const update = <K extends keyof EditorPost>(key: K, value: EditorPost[K]) =>
    setPost((prev) => ({ ...prev, [key]: value }))

  // 이미지 업로드 시 최신 slug/date를 사용하기 위한 ref
  const postRef = useRef(post)
  useEffect(() => {
    postRef.current = post
  }, [post])

  const uploadImage = useCallback(async (file: File) => {
    const { slug, date } = postRef.current
    const formData = new FormData()
    formData.append('file', file)
    formData.append('slug', slug)
    formData.append('date', date)

    const uploading = toast.loading(`${file.name} 업로드 중...`)
    try {
      const res = await fetch('/api/editor/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast.success('이미지가 Cloudflare R2에 업로드되었습니다.', { id: uploading })
      return data.url as string
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '업로드 실패', { id: uploading })
      throw error
    }
  }, [])

  const save = useCallback(async () => {
    if (savingRef.current) return
    savingRef.current = true
    setIsSaving(true)

    try {
      const res = await fetch('/api/editor/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const savedPost = { ...post, path: data.path as string }
      setPost(savedPost)
      setSavedSnapshot(JSON.stringify(savedPost))
      toast.success(`저장되었습니다: posts/${data.path}.mdx`)

      if (data.path !== post.path) {
        router.replace(`/editor?path=${encodeURIComponent(data.path)}`)
      } else {
        // 우측 상단 포스트 목록 갱신
        router.refresh()
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '저장 실패')
    } finally {
      savingRef.current = false
      setIsSaving(false)
    }
  }, [post, router])

  // Cmd/Ctrl + S 저장
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault()
        save()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [save])

  // 저장하지 않고 나가려고 하면 경고
  useEffect(() => {
    if (!isDirty) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  const openPost = (path: string) => {
    if (isDirty && !confirm('저장하지 않은 변경사항이 있습니다. 이동할까요?')) return
    router.push(path ? `/editor?path=${encodeURIComponent(path)}` : '/editor')
  }

  const addTag = (value: string) => {
    const tag = value.trim()
    if (tag && !post.tags.includes(tag)) update('tags', [...post.tags, tag])
    setTagInput('')
  }

  const onTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return // 한글 조합 중 Enter 무시
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag(tagInput)
    } else if (event.key === 'Backspace' && !tagInput && post.tags.length > 0) {
      update('tags', post.tags.slice(0, -1))
    }
  }

  return (
    <article className="px-4">
      <fieldset disabled={isSaving} className="min-w-0">
        {/* 에디터 설정 바 (포스트에는 표시되지 않는 영역) */}
        <div className="mx-auto mb-10 flex max-w-[900px] flex-wrap items-center gap-3 rounded-md border border-dashed border-gray-300 p-3 text-sm dark:border-neutral-700">
          <select
            className="h-9 max-w-[220px] rounded-md border border-gray-300 bg-transparent px-2 dark:border-neutral-700 dark:bg-neutral-900"
            value={post.path ?? ''}
            onChange={(event) => openPost(event.target.value)}
          >
            <option value="">+ 새 글</option>
            {posts.map((item) => (
              <option key={item.path} value={item.path}>
                {item.published ? '' : '[비공개] '}
                {item.title}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-1">
            <span className="text-gray-500">posts/{post.date.slice(0, 7).replace('-', '/')}/</span>
            <input
              className="h-9 w-[220px] rounded-md border border-gray-300 bg-transparent px-2 dark:border-neutral-700"
              placeholder="slug (영문)"
              value={post.slug}
              onChange={(event) => update('slug', toSlug(event.target.value))}
            />
            <span className="text-gray-500">.mdx</span>
          </label>

          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={post.published}
              onChange={(event) => update('published', event.target.checked)}
            />
            공개
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={post.adminOnly}
              onChange={(event) => update('adminOnly', event.target.checked)}
            />
            admin-only
          </label>

          <div className="ml-auto flex items-center gap-2">
            {post.path && post.published && !isDirty && (
              <Link
                href={`/posts/${post.path}`}
                target="_blank"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                포스트 보기 ↗
              </Link>
            )}
            <Button onClick={save} disabled={isSaving || !isDirty}>
              {isSaving ? '저장 중...' : isDirty ? '저장 (⌘S)' : '저장됨'}
            </Button>
          </div>
        </div>

        {/* 이하 app/posts/[...slug]/page.tsx 와 동일한 레이아웃 */}
        <div className="mx-auto flex max-w-[700px] gap-4">
          <div className="w-full">
            <div className="flex flex-col gap-4">
              <textarea
                rows={1}
                className="field-sizing-content w-full resize-none bg-transparent text-center text-4xl font-extrabold tracking-tight text-balance outline-none placeholder:text-gray-300 dark:placeholder:text-neutral-600"
                placeholder="제목"
                value={post.title}
                onChange={(event) => update('title', event.target.value)}
              />
              <div className="flex flex-col gap-2">
                <input
                  className="w-full bg-transparent text-center outline-none placeholder:text-gray-300 dark:placeholder:text-neutral-600"
                  placeholder="설명"
                  value={post.description}
                  onChange={(event) => update('description', event.target.value)}
                />
                <div className="flex items-center justify-center gap-2">
                  <CalendarIcon className="size-5 text-blue-600" />
                  <input
                    type="date"
                    className="bg-transparent text-center outline-none"
                    value={post.date}
                    onChange={(event) => update('date', event.target.value)}
                  />
                </div>
                <ul className="mb-4 flex list-none flex-wrap items-center justify-center gap-2">
                  {post.adminOnly && (
                    <li>
                      <Badge variant="secondary">admin-only</Badge>
                    </li>
                  )}
                  {post.tags.map((tag) => (
                    <li key={tag}>
                      <button
                        type="button"
                        title="클릭해서 삭제"
                        onClick={() =>
                          update(
                            'tags',
                            post.tags.filter((item) => item !== tag)
                          )
                        }
                      >
                        <Badge variant="secondary" className="hover:line-through">
                          {tag}
                        </Badge>
                      </button>
                    </li>
                  ))}
                  <li>
                    <input
                      list="editor-tag-list"
                      className="w-[120px] bg-transparent text-center text-xs outline-none placeholder:text-gray-400"
                      placeholder="+ 태그 (Enter)"
                      value={tagInput}
                      onChange={(event) => setTagInput(event.target.value)}
                      onKeyDown={onTagKeyDown}
                      onBlur={() => addTag(tagInput)}
                    />
                    <datalist id="editor-tag-list">
                      {allTags
                        .filter((tag) => !post.tags.includes(tag))
                        .map((tag) => (
                          <option key={tag} value={tag} />
                        ))}
                    </datalist>
                  </li>
                </ul>
              </div>
            </div>

            <MdxEditor
              readOnly={isSaving}
              markdown={initialPost.body}
              onChange={(body) => update('body', body)}
              onUploadImage={uploadImage}
            />
          </div>
        </div>
      </fieldset>
    </article>
  )
}
