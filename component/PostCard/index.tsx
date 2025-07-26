import { type Post } from '@/types/post'
import { getYYYYMMDD } from '@/utils/date'
import { Badge } from '@/component/Badge'

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <article
      className="border border-gray-200 dark:border-gray-500 p-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 
       transition-transform duration-200 ease-in-out"
      key={post.frontMatter.title}
    >
      <li>
        <a href={`/posts/${post.slug}`} className="block mb-4">
          <h3 className="">{post.frontMatter.title}</h3>

          <ul className="flex gap-2 mt-3 list-none">
            <p>{getYYYYMMDD(post.frontMatter.date)}</p>
            {post.frontMatter.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="basic">{tag}</Badge>
              </li>
            ))}
          </ul>
          <p className="mt-3">{post.frontMatter.description}</p>
        </a>
      </li>
    </article>
  )
}
