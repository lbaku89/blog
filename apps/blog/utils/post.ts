import fs from 'fs'
import frontMatter from 'front-matter'
import { sync } from 'glob'
import { type FrontMatter, type Post } from '@/types/post'
import { compile } from '@mdx-js/mdx'
import rehypeToc from '@jsdevtools/rehype-toc'
import rehypeStringify from 'rehype-stringify'
import { toHtml } from 'hast-util-to-html'
import rehypeSlug from 'rehype-slug'

const POST_ENTRY_PATH = `${process.cwd()}/posts`

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
  } catch (error) {
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
