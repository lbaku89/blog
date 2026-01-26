import React from 'react'
import { cn } from '@/utils/tailwind'

type InfoCardProps = {
  children: React.ReactNode
  className?: string
}

export const InfoCard: React.FC<InfoCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={cn(
        `bg-gray-50 dark:bg-neutral-800 rounded-lg`,
        `p-6 my-6 border border-gray-200 dark:border-neutral-700 prose dark:prose-invert max-w-none`,
        `[&>p+ul]:-mt-4 [&>p+ol]:-mt-4`,
        className
      )}
    >
      {children}
    </div>
  )
}
