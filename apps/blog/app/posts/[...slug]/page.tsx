import { getAllPosts, getPostBySlug, getTocFromMdx } from '@/utils/post'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/mdx-components'
import { Badge } from '@common-ui'
import { getYYYYMMDD } from '@/utils/date'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import { CalendarIcon } from '@heroicons/react/24/solid'
import { PostComments } from '@/component/PostComments'
import { SideToc } from '@/component/SideToc'
import { TypographyH1, TypographyH4 } from '@common-ui'
// import rehypeSanitize from 'rehype-sanitize'
// import rehypeStringify from 'rehype-stringify'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'

// Next.js 15에서 process.cwd() 사용 시 DYNAMIC_SERVER_USAGE 에러 방지
export const dynamic = 'force-static'

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
    <article className='px-4'>
      {/* 컴포넌트 맵을 전달 */}
      <div className="flex gap-4 mx-auto max-w-[750px]">
        {/* 포스트 헤더 + 포스팅 */}
        <div className="w-full">
          {/* 포스트 헤더 제목, 설명, 태그 등 */}
          <div className="flex flex-col gap-4">
            <TypographyH1 className="text-center">{currentPost.frontMatter.title}</TypographyH1>
            <div className="flex flex-col gap-2">
              <h5 className="text-center">{currentPost.frontMatter.description}</h5>
              <div className="flex items-center justify-center gap-2">
                <CalendarIcon className="size-5 text-blue-600"></CalendarIcon>
                <p className="text-center">{getYYYYMMDD(currentPost.frontMatter.date)}</p>
              </div>
              <ul className="mb-4 flex gap-2 justify-center list-none">
                {currentPost.frontMatter.tags.map((tag) => (
                  <li key={tag}>
                    <Badge variant="secondary">{tag}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* upper toc */}
          <div className="bg-gray-100 dark:bg-neutral-800 p-6 rounded-md mb-4 mt-10 xl:hidden">
            <div className="top-toc-container">
              <TypographyH4 className="mb-[10px] text-gray-900 dark:text-neutral-400 ">목차</TypographyH4>
              <hr className="mb-2 border-gray-300 dark:border-gray-600" />
              <div className="dark:text-neutral-400 p-2" dangerouslySetInnerHTML={{ __html: tocHtml }} />
            </div>
          </div>

          <div className="relative">
            {/* 포스팅 내용 */}
            <div className="prose dark:prose-invert post-wrapper pt-[30px] max-w-full ">
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
                          theme: {
                            light: 'one-light',
                            dark: 'github-dark',
                          },
                          defaultLanguage: { block: 'plaintext', inline: 'plaintext' },
                        },
                      ],

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
            {/* 오른쪽 사이드 TOC: xl 이상에서만 표시, 700px 밖에 위치 */}
            <SideToc tocHtml={tocHtml} />
          </div>

          <div className="mt-10">
            <PostComments />
          </div>
        </div>
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
