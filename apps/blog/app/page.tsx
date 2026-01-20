// import Image from 'next/image'
import { getAllPosts } from '@/utils/post'
import { InfiniteScrollPosts } from '@/component/InfiniteScrollPosts'
import { TypographyH1 } from '@common-ui'

// Next.js 15에서 process.cwd() 사용 시 DYNAMIC_SERVER_USAGE 에러 방지
export const dynamic = 'force-static'

export default async function Home() {
  const allPosts = await getAllPosts()
  // 초기 5개만 로드
  const initialPosts = allPosts.slice(0, 5)
  const hasMore = allPosts.length > 5
  
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
      <div className="mt-8 max-w-[800px] mx-auto">
        <TypographyH1 className="text-left">Recent Posts</TypographyH1>
        <InfiniteScrollPosts initialPosts={initialPosts} initialHasMore={hasMore} />
      </div>
    </>
  )
}
