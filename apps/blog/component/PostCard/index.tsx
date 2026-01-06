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

          <ul className="flex flex-wrap gap-2 mt-3 list-none">
            <TypographyP>{getYYYYMMDD(post.frontMatter.date)}</TypographyP>
            {post.frontMatter.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="secondary">{tag}</Badge>
              </li>
            ))}
          </ul>
          <TypographyP className="mt-3">{post.frontMatter.description}</TypographyP>
        </a>
      </li>
    </article>
  )
}
