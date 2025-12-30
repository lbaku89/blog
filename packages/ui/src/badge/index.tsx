import React from 'react'

type Props = {
  children: React.ReactNode
  variant?: 'basic'
} & React.HTMLAttributes<HTMLSpanElement>

export const Badge = ({ children, ...props }: Props) => {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200  shrink-0"
      {...props}
    >
      {children}
    </span>
  )
}
