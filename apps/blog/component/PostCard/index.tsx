import { type Post } from '@/types/post'
import { getYYYYMMDD } from '@/utils/date'
import { Badge } from '@common-ui'
import { TypographyH3, TypographyP } from '@common-ui'

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <article
      className="border border-gray-200 dark:border-gray-500 p-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 
       transition-transform duration-200 ease-in-out"
      key={post.frontMatter.title}
    >
      <li>
        <a href={`/posts/${post.slug}`} className="block mb-4">
          <TypographyH3 className="">{post.frontMatter.title}</TypographyH3>
        </a>
        <ul className="flex flex-wrap gap-2 mt-3 list-none">
          <TypographyP>{getYYYYMMDD(post.frontMatter.date)}</TypographyP>
          {/* admin 전용 포스팅이면 "admin-only" 태그 추가 */}
          {post.frontMatter.adminOnly && (
            <li key="admin-only">
              <a href="/?tag=admin-only" className="hover:underline">
                <Badge variant="secondary">admin-only</Badge>
              </a>
            </li>
          )}
          {/* 일반 태그 표시 */}
          {post.frontMatter.tags.map((tag) => (
            <li key={tag}>
              <a href={`/?tag=${encodeURIComponent(tag)}`} className="hover:underline">
                <Badge variant="secondary">{tag}</Badge>
              </a>
            </li>
          ))}
        </ul>
        <a href={`/posts/${post.slug}`} className="block">
          <TypographyP className="mt-3">{post.frontMatter.description}</TypographyP>
        </a>
      </li>
    </article>
  )
}
