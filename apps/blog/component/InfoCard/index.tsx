import React from 'react'
import { cn } from '@/utils/tailwind'

type InfoCardVariant = 'default' | 'info' | 'warning' | 'success' | 'error'

type InfoCardProps = {
  children: React.ReactNode
  className?: string
  variant?: InfoCardVariant
}

const variantStyles: Record<InfoCardVariant, string> = {
  default: 'bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
}

export const InfoCard: React.FC<InfoCardProps> = ({ children, className = '', variant = 'default' }) => {
  return (
    <div
      className={cn(
        `rounded-lg p-6 my-6 border prose dark:prose-invert max-w-none`,
        `[&>p+ul]:-mt-4 [&>p+ol]:-mt-4`,
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  )
}
