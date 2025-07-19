import { getAllPosts, getPostBySlug, getTocFromMdx } from '@/utils/post'
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
  const { tocHtml } = await getTocFromMdx(currentPost?.body || '')

  if (!currentPost) {
    return <div>Post not found</div>
  }

  return (
    <article>
      {/* 컴포넌트 맵을 전달 */}
      <div className="flex gap-4">
        {/* 포스트 헤더 + 포스팅 */}
        <div>
          {/* 포스트 헤더 제목, 설명, 태그 등 */}
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
          {/* 포스팅 내용 */}
          <div className="prose dark:prose-invert max-w-none p-2">
            <MDXRemote
              source={currentPost.body}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    /** @description prevent xss */
                    rehypeSanitize,
                    /** @description rehype tree 를 최종 html로 변환 */
                    rehypeStringify,
                    [rehypePrettyCode, { theme: 'tokyo-night' }],

                    /** @description add id to heading tag */
                    rehypeSlug,
                    [
                      rehypeAutolinkHeadings,
                      {
                        behavior: 'wrap',
                        properties: {
                          className: ['no-underline hover:text-blue-700 dark:hover:text-blue-400'],
                        },
                      },
                    ],
                  ],
                },
              }}
            />
          </div>
        </div>
        {/* toc영역 */}
        <div>
          <div className="toc-container">
            <h4 className="mb-[10px] text-gray-900 dark:text-gray-100">Table of Content</h4>
            <div dangerouslySetInnerHTML={{ __html: tocHtml }} />
          </div>
        </div>
        {/* </div> */}
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
