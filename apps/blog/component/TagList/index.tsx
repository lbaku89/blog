import { Badge } from '@common-ui'
import { TypographyH2 } from '@common-ui'

interface TagStats {
  tag: string
  count: number
}

interface TagListProps {
  tags: TagStats[]
}

export const TagList = ({ tags }: TagListProps) => {
  return (
    <div>
      <TypographyH2 className="mb-3 text-lg">Tags</TypographyH2>
      <div className="flex flex-col gap-2">
        {tags.map(({ tag, count }) => (
          <div
            key={tag}
            className="flex items-center justify-between py-0.5 px-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Badge variant="secondary" className="py-0 leading-tight">{tag}</Badge>
            <span className="text-[10px] text-gray-600 dark:text-gray-400 ml-1.5">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
