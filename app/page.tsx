// import Image from 'next/image'
import { getAllPosts } from '@/utils/post'
import { PostCard } from '@/component/PostCard'
export default async function Home() {
  const allPosts = await getAllPosts()
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
      <div className="mt-8">
        <h1>Recent Posts</h1>
        <ul className="list-none list-inside mt-4 flex flex-col gap-5">
          {allPosts.map((post) => {
            return <PostCard post={post} key={post.slug} />
          })}
        </ul>
      </div>
    </>
  )
}
