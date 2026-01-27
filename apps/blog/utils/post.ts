import fs from 'fs'
import path from 'path'
import frontMatter from 'front-matter'
import { sync } from 'glob'
import { type FrontMatter, type Post } from '@/types/post'
import { compile } from '@mdx-js/mdx'
import rehypeToc from '@jsdevtools/rehype-toc'
// import rehypeStringify from 'rehype-stringify'
import { toHtml } from 'hast-util-to-html'
import rehypeSlug from 'rehype-slug'

// Next.js 15에서는 process.cwd() 사용 시 DYNAMIC_SERVER_USAGE 에러 발생
// 상대 경로를 사용하여 해결
const POST_ENTRY_PATH = path.join(process.cwd(), 'posts')

export async function getAllPosts(): Promise<Post[]> {
  /**
   * @example [
   * '/Users/user/code/blog/posts/2025/07/11/progress-bar.mdx'
   * '/Users/user/code/blog/posts/2025/05/10/currying.mdx',
   * ]
   */
  const files = sync(`${POST_ENTRY_PATH}/**/*.md*`).reverse()

  const posts: Post[] = []

  files.forEach((path) => {
    const file = fs.readFileSync(path, { encoding: 'utf8' })

    const frontMatterResult: {
      attributes: FrontMatter
      body: string
    } = frontMatter<FrontMatter>(file)

    if (frontMatterResult.attributes.published) {
      /**
       * @example '2025/07/progress-bar'
       */
      const slug = path
        .slice(POST_ENTRY_PATH.length + 1)
        .replaceAll('.mdx', '')
        .replaceAll('.md', '')

      /**
       * @example ['JavaScript', 'Functional Programming', 'Currying']
       */
      const tags = frontMatterResult.attributes.tags.map((tag: string) => tag.trim())
      const post: Post = {
        frontMatter: {
          ...frontMatterResult.attributes,
          tags,
          date: new Date(frontMatterResult.attributes.date),
        },
        body: frontMatterResult.body,
        path,
        slug,
      }

      posts.push(post)
    }
  })

  posts.sort((a, b) => {
    if (a.frontMatter.date < b.frontMatter.date) {
      return 1
    }
    if (a.frontMatter.date > b.frontMatter.date) {
      return -1
    }
    return 0
  })

  return posts
}

/**
  * @description slug에 해당하는 포스트를 get
 *  @param slug - 포스트의 slug (예: '2025/07/rogress-bar')

 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  // 직접 파일 경로로 접근
  const filePath = `${POST_ENTRY_PATH}/${slug}.mdx`

  try {
    const file = fs.readFileSync(filePath, { encoding: 'utf8' })
    const frontMatterResult: {
      attributes: FrontMatter
      body: string
    } = frontMatter<FrontMatter>(file)

    if (!frontMatterResult.attributes.published) {
      return null
    }

    const tags = frontMatterResult.attributes.tags.map((tag: string) => tag.trim())

    return {
      frontMatter: {
        ...frontMatterResult.attributes,
        tags,
        date: new Date(frontMatterResult.attributes.date), // 문자열 그대로 사용
      },
      body: frontMatterResult.body,
      slug,
      path: filePath,
    }
  } catch {
    // 파일이 없거나 에러 발생시 null 반환
    return null
  }
}

/** @description mdx 에서 table of contents 추출하는 함수 */
export async function getTocFromMdx(source: string) {
  let tocHtml = ''
  const customizeTOC = (toc: any) => {
    tocHtml = toHtml(toc)
    return false
  }

  await compile(source, {
    rehypePlugins: [rehypeSlug, [rehypeToc, { headings: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], customizeTOC }]],
  })

  return { tocHtml }
}

/**
 * @description 모든 포스트에서 태그 통계를 계산하는 함수
 * @param posts - 필터링된 포스트 배열 (admin 권한에 따라 필터링됨)
 * @returns 태그 이름과 해당 태그를 가진 포스트 개수를 담은 객체 배열
 */
export function getTagStats(posts: Post[]): Array<{ tag: string; count: number }> {
  const tagMap = new Map<string, number>()

  // posts 배열에 admin 전용 포스팅이 포함되어 있다는 것은 admin 권한이 있다는 의미
  // 따라서 모든 포스팅의 태그를 카운트 (admin 전용 포스팅의 태그도 포함)
  posts.forEach((post) => {
    post.frontMatter.tags.forEach((tag) => {
      const trimmedTag = tag.trim()
      tagMap.set(trimmedTag, (tagMap.get(trimmedTag) || 0) + 1)
    })
  })

  // admin 전용 포스팅 개수 확인 (필터링된 포스팅 배열에서 확인)
  const adminOnlyPostCount = posts.filter((post) => post.frontMatter.adminOnly).length

  const result: Array<{ tag: string; count: number }> = Array.from(tagMap.entries()).map(([tag, count]) => ({
    tag,
    count,
  }))

  // admin 전용 포스팅이 있으면 "admin-only" 태그 자동 추가
  if (adminOnlyPostCount > 0) {
    result.push({
      tag: 'admin-only',
      count: adminOnlyPostCount,
    })
  }

  return result.sort((a, b) => b.count - a.count) // 개수 내림차순 정렬
}

/**
 * @description 특정 태그로 포스트를 필터링하는 함수
 * @param posts - 필터링할 포스트 배열 (이미 admin 권한에 따라 필터링됨)
 * @param tag - 필터링할 태그 이름
 * @returns 해당 태그를 가진 포스트 배열
 */
export function getPostsByTag(posts: Post[], tag: string): Post[] {
  const trimmedTag = tag.trim()

  // "admin-only" 태그는 admin 전용 포스팅을 필터링
  if (trimmedTag === 'admin-only') {
    return posts.filter((post) => post.frontMatter.adminOnly === true)
  }

  // admin 권한이 있는지 확인 (posts에 admin 전용 포스팅이 포함되어 있으면 admin 권한이 있음)
  const hasAdminAccess = posts.some((post) => post.frontMatter.adminOnly)

  // 일반 태그는 실제 태그 배열에서 찾기
  return posts.filter((post) => {
    // admin 권한이 있으면 admin 전용 포스팅도 포함, 없으면 제외
    if (post.frontMatter.adminOnly && !hasAdminAccess) {
      return false
    }
    return post.frontMatter.tags.some((tag) => tag.trim() === trimmedTag)
  })
}

/**
 * @description admin 권한에 따라 포스트를 필터링하는 함수
 * @param posts - 필터링할 포스트 배열
 * @param isAdmin - admin 권한이 있는지 여부
 * @returns admin 권한이 있으면 모든 포스트, 없으면 adminOnly가 false인 포스트만 반환
 */
export function filterPostsByAdminAccess(posts: Post[], isAdmin: boolean): Post[] {
  if (isAdmin) {
    return posts
  }
  return posts.filter((post) => !post.frontMatter.adminOnly)
}
