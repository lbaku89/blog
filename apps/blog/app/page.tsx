import { getAllPosts, filterPostsByAdminAccess } from '@/utils/post'
import { FilteredPosts } from '@/component/FilteredPosts'
import { ProfileSection } from '@/component/ProfileSection'
import { isAdminAuthenticated } from '@/lib/auth'
import { notFound } from 'next/navigation'

// Next.js 15에서 process.cwd() 사용 시 DYNAMIC_SERVER_USAGE 에러 방지
export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[]; tag?: string | string[] }>
}) {
  const { page, tag } = await searchParams
  if (Array.isArray(page) || Array.isArray(tag)) notFound()
  const allPostsRaw = await getAllPosts()

  // admin 권한 체크 및 필터링
  const isAdmin = await isAdminAuthenticated()
  const allPosts = filterPostsByAdminAccess(allPostsRaw, isAdmin)

  return (
    <div className="mx-auto mt-8 w-full max-w-[800px] px-4">
      <ProfileSection />
      <FilteredPosts allPosts={allPosts} page={page} tag={tag} />
    </div>
  )
}
