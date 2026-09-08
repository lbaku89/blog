import { getAllPosts, filterPostsByAdminAccess } from '@/utils/post'
import { FilteredPosts } from '@/component/FilteredPosts'
import { ProfileSection } from '@/component/ProfileSection'
import { Suspense } from 'react'
import { isAdminAuthenticated } from '@/lib/auth'

// Next.js 15에서 process.cwd() 사용 시 DYNAMIC_SERVER_USAGE 에러 방지
export const dynamic = 'force-dynamic'

export default async function Home() {
  const allPostsRaw = await getAllPosts()

  // admin 권한 체크 및 필터링
  const isAdmin = await isAdminAuthenticated()
  const allPosts = filterPostsByAdminAccess(allPostsRaw, isAdmin)

  return (
    <div className="mx-auto mt-8 w-full max-w-[800px] px-4">
      <ProfileSection />
      <Suspense fallback={<div>로딩 중...</div>}>
        <FilteredPosts allPosts={allPosts} />
      </Suspense>
    </div>
  )
}
