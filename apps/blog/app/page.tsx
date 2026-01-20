// import Image from 'next/image'
import { getAllPosts, getTagStats } from '@/utils/post'
import { TagList } from '@/component/TagList'
import { FilteredPosts } from '@/component/FilteredPosts'
import { Suspense } from 'react'

// Next.js 15에서 process.cwd() 사용 시 DYNAMIC_SERVER_USAGE 에러 방지
export const dynamic = 'force-static'

export default async function Home() {
  const allPosts = await getAllPosts()
  const tagStats = getTagStats(allPosts)
  
  return (
    <>
      {/* <div className="p-8 rounded-md border border-gray-200 dark:border-gray-700">
        <h3 className="underline underline-offset-8 decoration-1 decoration-gray-200 dark:decoration-gray-700">
          Hello I'm Hyunwoo, a front-end developer.👋
        </h3>
        <ul className="list-disc list-inside mt-4">
          <li>Main languages : TypeScript, JavaScript</li>
          <li>Main libraries/frameworks : Next.js, React.js</li>
        </ul>
      </div> */}
      <div className="mt-8 max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          {/* 좌측: 포스트 목록 */}
          <div className="flex-1 max-w-[800px] min-w-0 order-2 lg:order-1">
            <Suspense fallback={<div>로딩 중...</div>}>
              <FilteredPosts allPosts={allPosts} />
            </Suspense>
          </div>
          
          {/* 우측: 태그 목록 */}
          <aside className="w-full lg:w-[250px] flex-shrink-0 order-1 lg:order-2">
            <Suspense fallback={<div>로딩 중...</div>}>
              <TagList tags={tagStats} />
            </Suspense>
          </aside>
        </div>
      </div>
    </>
  )
}

