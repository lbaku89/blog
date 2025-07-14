import { getAllPosts, getPostBySlug } from '@/utils/post'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/mdx-components'
import { Badge } from '@/component/Badge'
import { getYYYYMMDD } from '@/utils/date'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import { CalendarIcon } from '@heroicons/react/24/solid'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const slugPath = slug.join('/')

  // 개별 포스트만 조회 (더 효율적)
  const currentPost = await getPostBySlug(slugPath)

  if (!currentPost) {
    return <div>Post not found</div>
  }

  return (
    <article>
      {/* 포스트 제목, 설명, 태그 등 */}
      <div className="flex flex-col gap-4">
        <h1 className="text-center">{currentPost.frontMatter.title}</h1>
        <div className="flex flex-col gap-2">
          <h5 className="text-center">{currentPost.frontMatter.description}</h5>
          <div className="flex items-center justify-center gap-2">
            <CalendarIcon className="size-5 text-blue-600"></CalendarIcon>
            <p className="text-center">{getYYYYMMDD(currentPost.frontMatter.date)}</p>
          </div>
          <ul className="mb-4 flex gap-2 justify-center list-none">
            {currentPost.frontMatter.tags.map((tag) => (
              <li key={tag}>
                <Badge>{tag}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* 컴포넌트 맵을 전달 */}
      <div className="p-2 prose  dark:prose-invert max-w-none">
        <MDXRemote
          source={currentPost.body}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                [
                  rehypePrettyCode,
                  {
                    theme: 'night-owl',
                  },
                  rehypeSanitize,
                  rehypeStringify,
                  /**
                   * @todo 하단 2개 플러그인 적용 확인 필요
                   */
                  rehypeAutolinkHeadings,
                  rehypeSlug,
                ],
              ],
            },
          }}
        />
      </div>
    </article>
  )
}

/**
 * @description build 시에 해당 slug에 대한 정적 페이지를 생성
 * @reference https://nextjs.org/docs/14/app/api-reference/file-conventions/route-seg
 */
export async function generateStaticParams() {
  const posts = await getAllPosts()

  /**
   * @example [
   * { slug: ['2025', '05', 'test'] },
   * { slug: ['2025', '07', 'progress-bar'] },
   * ]
   */
  return posts.map((post) => ({
    slug: post.slug.split('/'),
  }))
}

/**
 * @description generateStaticParams 없는 목로의 경우 404 page로 처리
 * @reference https://nextjs.org/docs/14/app/api-reference/file-conventions/route-segment-config#dynamicparams
 */
export const dynamicParams = false
