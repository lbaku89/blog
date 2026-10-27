import fs from 'fs'
import path from 'path'
import frontMatter from 'front-matter'
import { sync } from 'glob'
import { type FrontMatter } from '@/types/post'

/**
 * @description 로컬 에디터는 개발 서버(pnpm dev)에서만 동작
 * 배포 환경에서는 에디터 페이지/API 모두 404 처리
 */
export const isEditorEnabled = process.env.NODE_ENV === 'development'

const POST_ENTRY_PATH = path.join(process.cwd(), 'posts')

/** @example 'github-contributions-with-graphql' */
export const SLUG_REGEX = /^[\w()-]+$/
/** @example '2026-10-18' */
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

export function isValidPostDate(value: string) {
  if (!DATE_REGEX.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}
/** @example '2026/10/github-contributions-with-graphql' */
const POST_PATH_REGEX = /^\d{4}\/\d{2}\/[\w()-]+$/

export interface EditorPost {
  /** 기존 포스트의 경로 (새 글이면 null) @example '2026/10/my-post' */
  path: string | null
  slug: string
  date: string
  title: string
  description: string
  tags: string[]
  published: boolean
  adminOnly: boolean
  body: string
}

export interface EditorPostSummary {
  path: string
  title: string
  date: string
  published: boolean
}

export function isValidPostPath(postPath: string) {
  return POST_PATH_REGEX.test(postPath)
}

/** @description date + slug → 포스트 경로 @example ('2026-10-18', 'my-post') → '2026/10/my-post' */
export function toPostPath(date: string, slug: string) {
  const [yyyy, mm] = date.split('-')
  return `${yyyy}/${mm}/${slug}`
}

export function getPostFilePath(postPath: string) {
  return path.join(POST_ENTRY_PATH, `${postPath}.mdx`)
}

/** @description front-matter(js-yaml)는 따옴표 없는 날짜를 Date로 파싱하므로 문자열로 통일 */
function normalizeDate(date: unknown) {
  if (date instanceof Date) return date.toISOString().slice(0, 10)
  return String(date ?? '')
}

/** @description 비공개(published: false) 글까지 포함한 전체 포스트 목록 */
export function listEditorPosts(): EditorPostSummary[] {
  return sync(`${POST_ENTRY_PATH}/**/*.mdx`)
    .map((filePath) => filePath.slice(POST_ENTRY_PATH.length + 1).replace(/\.mdx$/, ''))
    .filter(isValidPostPath)
    .map((postPath) => {
      const { attributes } = frontMatter<Partial<FrontMatter>>(fs.readFileSync(getPostFilePath(postPath), 'utf8'))
      return {
        path: postPath,
        title: attributes.title ?? postPath,
        date: normalizeDate(attributes.date),
        published: Boolean(attributes.published),
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function readEditorPost(postPath: string): EditorPost | null {
  if (!isValidPostPath(postPath)) return null

  try {
    const file = fs.readFileSync(getPostFilePath(postPath), 'utf8')
    const { attributes, body } = frontMatter<Partial<FrontMatter>>(file)
    // front-matter는 구분자 뒤의 빈 줄까지 소비하므로 원문에서 본문을 분리한다.
    const header = /^(?:\uFEFF)?---\r?\n[\s\S]*?^---[\t ]*(?:\r?\n|$)/m.exec(file)
    const originalBody = header ? file.slice(header[0].length).replace(/^\r?\n/, '') : body

    return {
      path: postPath,
      slug: postPath.split('/').at(-1)!,
      date: normalizeDate(attributes.date),
      title: attributes.title ?? '',
      description: attributes.description ?? '',
      tags: (attributes.tags ?? []).map((tag) => tag.trim()),
      published: Boolean(attributes.published),
      adminOnly: Boolean(attributes.adminOnly),
      body: originalBody,
    }
  } catch {
    return null
  }
}

/** @description 모든 포스트에서 사용 중인 태그 (자동완성용) */
export function getAllEditorTags(): string[] {
  const tags = new Set<string>()
  listEditorPosts().forEach(({ path: postPath }) => {
    readEditorPost(postPath)?.tags.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags).sort()
}

/** @description YAML과 호환되는 JSON 문자열로 직렬화 */
function quote(value: string) {
  // JSON 문자열은 YAML에서도 유효하며 줄바꿈과 제어 문자도 손실 없이 보존한다.
  return JSON.stringify(value)
}

/** @description 기존 포스트들과 동일한 형태의 frontmatter + 본문으로 직렬화 */
export function serializePost(post: Omit<EditorPost, 'path' | 'slug'>) {
  const lines = [
    '---',
    `title: ${quote(post.title)}`,
    `description: ${quote(post.description)}`,
    `date: ${quote(post.date)}`,
    `tags: [${post.tags.map(quote).join(', ')}]`,
    `published: ${post.published}`,
    ...(post.adminOnly ? ['adminOnly: true'] : []),
    '---',
  ]

  return `${lines.join('\n')}\n\n${post.body}`
}
