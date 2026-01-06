import React from 'react'
import { cn } from '../../lib/utils'
type TypographyH1Props = React.ComponentProps<'h1'> & {
  children: React.ReactNode
}

export function TypographyH1({ children, className, ...props }: TypographyH1Props) {
  return (
    <h1
      className={cn('scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance', className)}
      {...props}
    >
      {children}
    </h1>
  )
}

type TypographyH2Props = React.ComponentProps<'h2'> & {
  children: React.ReactNode
}

export function TypographyH2({ children, className, ...props }: TypographyH2Props) {
  return (
    <h2
      className={cn('scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

type TypographyH3Props = React.ComponentProps<'h3'> & {
  children: React.ReactNode
}

export function TypographyH3({ children, className, ...props }: TypographyH3Props) {
  return (
    <h3 className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', className)} {...props}>
      {children}
    </h3>
  )
}

type TypographyH4Props = React.ComponentProps<'h4'> & {
  children: React.ReactNode
}

export function TypographyH4({ children, className, ...props }: TypographyH4Props) {
  return (
    <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)} {...props}>
      People stopped telling jokes
    </h4>
  )
}

type TypographyPProps = React.ComponentProps<'p'> & {
  children: React.ReactNode
}

export function TypographyP({ children, className, ...props }: TypographyPProps) {
  return (
    <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)} {...props}>
      {children}
    </p>
  )
}

type TypographyBlockquoteProps = React.ComponentProps<'blockquote'> & {
  children: React.ReactNode
}

export function TypographyBlockquote({ children, className, ...props }: TypographyBlockquoteProps) {
  return (
    <blockquote className={cn('mt-6 border-l-2 pl-6 italic', className)} {...props}>
      {children}
    </blockquote>
  )
}

type TypographyInlineCodeProps = React.ComponentProps<'code'> & {
  children: React.ReactNode
}

export function TypographyInlineCode({ children, className, ...props }: TypographyInlineCodeProps) {
  return (
    <code
      className={cn('bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold', className)}
      {...props}
    >
      {children}
    </code>
  )
}

type TypographyLeadProps = React.ComponentProps<'p'> & {
  children: React.ReactNode
}

export function TypographyLead({ children, className, ...props }: TypographyLeadProps) {
  return (
    <p className={cn('text-muted-foreground text-xl', className)} {...props}>
      {children}
    </p>
  )
}

type TypographyLargeProps = React.ComponentProps<'div'> & {
  children: React.ReactNode
}

export function TypographyLarge({ children, className, ...props }: TypographyLargeProps) {
  return (
    <div className={cn('text-lg font-semibold', className)} {...props}>
      {children}
    </div>
  )
}

type TypographySmallProps = React.ComponentProps<'small'> & {
  children: React.ReactNode
}

export function TypographySmall({ children, className, ...props }: TypographySmallProps) {
  return (
    <small className={cn('text-sm leading-none font-medium', className)} {...props}>
      {children}
    </small>
  )
}

type TypographyMutedProps = React.ComponentProps<'p'> & {
  children: React.ReactNode
}

export function TypographyMuted({ children, className, ...props }: TypographyMutedProps) {
  return (
    <p className={cn('text-muted-foreground text-sm', className)} {...props}>
      {children}
    </p>
  )
}
