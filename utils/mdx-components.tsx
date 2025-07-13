import { ProgressBar, ProgressBar2, ProgressBar3 } from '@/component/ProgressBar'

type HeadingProps = {
  id?: string
  children?: React.ReactNode
}

const heading = (As: 'h1' | `h2` | `h3` | `h4` | `h5` | `h6`) => {
  const Heading = ({ id, children }: HeadingProps) => (
    <a href={`#${id}`} className="group relative no-underline">
      <As id={id}>{children}</As>
    </a>
  )
  Heading.displayName = As
  return Heading
}

export const mdxComponents = {
  ProgressBar,
  ProgressBar2,
  ProgressBar3,
  // 필요한 다른 컴포넌트들 추가 가능
}
