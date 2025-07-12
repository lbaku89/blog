import fs from 'fs'
import frontMatter from 'front-matter'
import { sync } from 'glob'

const POST_PATH = `${process.cwd()}/posts`

interface FrontMatter {
  title: string
  description: string
  date: string
  published: boolean
  tags: string[]
}
interface Post {
  frontMatter: Omit<FrontMatter, 'date'> & {
    date: Date
  }
  body: string
  slug: string
  path: string
}

export async function getAllPosts(): Promise<Post[]> {
  /**
   * @example [
   * '/Users/user/code/blog/posts/2025/07/11/progress-bar.mdx'
   * '/Users/user/code/blog/posts/2025/05/10/currying.mdx',
   * ]
   */
  const files = sync(`${POST_PATH}/**/*.md*`).reverse()

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
        .slice(POST_PATH.length + 1)
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
