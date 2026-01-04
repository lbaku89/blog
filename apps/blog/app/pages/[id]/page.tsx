import { getAllPosts } from '@/utils/post'
import { POSTS_PER_PAGE } from '@/constants/post'
import { PostCard } from '@/component/PostCard'
export const dynamic = 'error'
import { Pagination } from '@/component/Pagination'

/**
 * @returns [{slug:1}, {slug:2}, ...]
 */
export async function generateStaticParams() {
  const posts = await getAllPosts()

  /**
   * @description 페이지 번호를 생성
   * @example [{ id: '1' }, { id: '2' }, ... { id: '3' }]
   */
  return new Array(Math.ceil(posts.length / POSTS_PER_PAGE)).map((_, i) => ({ id: `${i + 1}` }))
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const allPosts = await getAllPosts()
  const pageNo = parseInt(params.id)

  const [startIndex, endIndex] = [(pageNo - 1) * POSTS_PER_PAGE, pageNo * POSTS_PER_PAGE]

  const posts = allPosts.slice(startIndex, endIndex)

  return (
    <div className="max-w-[800px] mx-auto">
      <ul className="list-none list-inside mt-4 flex flex-col gap-5">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
      <div className="my-[40px]">
        <Pagination currentPage={pageNo} totalPages={Math.ceil(allPosts.length / POSTS_PER_PAGE)} />
      </div>
    </div>
  )
}
