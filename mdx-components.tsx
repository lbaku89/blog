import type { MDXComponents } from 'mdx/types'
import { ProgressBar, ProgressBar2, ProgressBar3 } from './component/ProgressBar'
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  }
}


