import { getAllPosts, filterPostsByAdminAccess } from '@/utils/post'
import { POSTS_PER_PAGE } from '@/constants/post'
import { PostCard } from '@/component/PostCard'
import { Pagination } from '@/component/Pagination'
import { isAdminAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * @returns [{slug:1}, {slug:2}, ...]
 */
export async function generateStaticParams() {
  // 정적 생성 시에는 admin 권한을 체크할 수 없으므로 모든 포스트를 기준으로 생성
  // 실제 렌더링 시에는 필터링됨
  const posts = await getAllPosts()

  /**
   * @description 페이지 번호를 생성
   * @example [{ id: '1' }, { id: '2' }, ... { id: '3' }]
   */
  return new Array(Math.ceil(posts.length / POSTS_PER_PAGE)).map((_, i) => ({ id: `${i + 1}` }))
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const allPostsRaw = await getAllPosts()

  // admin 권한 체크 및 필터링
  const isAdmin = await isAdminAuthenticated()
  const allPosts = filterPostsByAdminAccess(allPostsRaw, isAdmin)

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
