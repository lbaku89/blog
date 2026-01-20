'use client'

import { Badge } from '@common-ui'
import { TypographyH2 } from '@common-ui'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface TagStats {
  tag: string
  count: number
}

interface TagListProps {
  tags: TagStats[]
}

export const TagList = ({ tags }: TagListProps) => {
  const searchParams = useSearchParams()
  const selectedTag = searchParams.get('tag')
  
  return (
    <div>
      <TypographyH2 className="mb-3 text-lg">Tags</TypographyH2>
      <div className="flex flex-row flex-wrap gap-2 lg:flex-col">
        {tags.map(({ tag, count }) => {
          const isSelected = selectedTag === tag
          return (
            <Link
              key={tag}
              href={`/?tag=${encodeURIComponent(tag)}`}
              className={`flex items-center gap-1.5 py-0.5 px-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                isSelected ? 'bg-gray-200 dark:bg-gray-700' : ''
              } lg:justify-between`}
            >
              <Badge 
                variant={isSelected ? "default" : "secondary"} 
                className="py-0 leading-tight"
              >
                {tag}
              </Badge>
              <span className="text-[10px] text-gray-600 dark:text-gray-400 lg:ml-1.5">{count}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
