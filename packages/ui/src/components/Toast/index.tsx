'use client'
import * as React from 'react'
import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from 'lucide-react'

// @types/react@19와 sonner/lucide-react 타입 호환을 위한 단언
const ToasterPrimitive = Sonner as React.ComponentType<ToasterProps>
const SuccessIcon = CircleCheckIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>
const InfoIconComponent = InfoIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>
const WarningIcon = TriangleAlertIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>
const ErrorIcon = OctagonXIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>
const LoadingIcon = Loader2Icon as React.ComponentType<React.SVGProps<SVGSVGElement>>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()
  return (
    <ToasterPrimitive
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <SuccessIcon className="size-4" />,
        info: <InfoIconComponent className="size-4" />,
        warning: <WarningIcon className="size-4" />,
        error: <ErrorIcon className="size-4" />,
        loading: <LoadingIcon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'hsl(var(--popover))',
          '--normal-text': 'hsl(var(--popover-foreground))',
          '--normal-border': 'hsl(var(--border))',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  )
}
export { Toaster }
