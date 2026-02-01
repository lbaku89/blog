// import Image from 'next/image'
import { getAllPosts, getTagStats, filterPostsByAdminAccess } from '@/utils/post'
import { TagList } from '@/component/TagList'
import { FilteredPosts } from '@/component/FilteredPosts'
import { ProfileSection } from '@/component/ProfileSection'
import { Suspense } from 'react'
import { isAdminAuthenticated } from '@/lib/auth'
import { GitHubContribution } from '@/component/GitHubContribution'

// Next.js 15에서 process.cwd() 사용 시 DYNAMIC_SERVER_USAGE 에러 방지
export const dynamic = 'force-dynamic'

export default async function Home() {
  const allPostsRaw = await getAllPosts()

  // admin 권한 체크 및 필터링
  const isAdmin = await isAdminAuthenticated()
  const allPosts = filterPostsByAdminAccess(allPostsRaw, isAdmin)

  // 태그 통계 계산
  // 필터링된 포스팅만 사용 (admin 권한이 없으면 admin 전용 포스팅 제외됨)
  const tagStats = getTagStats(allPosts)

  return (
    <>
      <div className="mt-8 max-w-[1100px] mx-auto px-4">
        <div className="flex justify-between mb-8 gap-x-[50px]">
          {/* 프로필 섹션 */}
          <div className="flex-1 max-w-[744px] h-[280px] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
            <ProfileSection />
          </div>

          {/* GitHub Contribution 잔디 */}
          <div className="hidden lg:block h-[280px] border-gray-200 dark:border-gray-700">
            <GitHubContribution username="lbaku89" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-[50px] justify-center items-start">
          {/* 좌측: 포스트 목록 */}
          <div className="flex-1 max-w-[800px] min-w-0 order-2 lg:order-1">
            <Suspense fallback={<div>로딩 중...</div>}>
              <FilteredPosts allPosts={allPosts} />
            </Suspense>
          </div>

          {/* 우측: 태그 목록 */}
          <aside className="w-full lg:w-[274px] flex-shrink-0 order-1 lg:order-2 lg:sticky lg:top-8">
            <Suspense fallback={<div>로딩 중...</div>}>
              <TagList tags={tagStats} />
            </Suspense>
          </aside>
        </div>
      </div>
    </>
  )
}
