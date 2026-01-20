import fs from 'fs'
import path from 'path'
import frontMatter from 'front-matter'
import { sync } from 'glob'
import { type FrontMatter, type Post } from '@/types/post'
import { compile } from '@mdx-js/mdx'
import rehypeToc from '@jsdevtools/rehype-toc'
import rehypeStringify from 'rehype-stringify'
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
 * @returns 태그 이름과 해당 태그를 가진 포스트 개수를 담은 객체 배열
 */
export function getTagStats(posts: Post[]): Array<{ tag: string; count: number }> {
  const tagMap = new Map<string, number>()

  posts.forEach((post) => {
    post.frontMatter.tags.forEach((tag) => {
      const trimmedTag = tag.trim()
      tagMap.set(trimmedTag, (tagMap.get(trimmedTag) || 0) + 1)
    })
  })

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count) // 개수 내림차순 정렬
}
