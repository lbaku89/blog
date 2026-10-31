import { ProgressBar, ProgressBar2, ProgressBar3 } from '@/component/ProgressBar'
import { InfoCard } from '@/component/InfoCard'
import Image from 'next/image'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import styles from './image-caption.module.css'

function ImageCaption({ title, children }: { title?: string; children: ReactNode }) {
  if (!title?.trim()) return children

  // Markdown 이미지는 p 안에도 들어가므로 블록 요소인 figure 대신 span으로 감싼다.
  return (
    <span className={styles.figure} role="figure" aria-label={title}>
      {children}
      <span className={styles.caption}>{title}</span>
    </span>
  )
}

export const mdxComponents = {
  ProgressBar,
  ProgressBar2,
  ProgressBar3,
  InfoCard,
  img: (props: ComponentPropsWithoutRef<'img'>) => {
    return (
      <ImageCaption title={props.title}>
        {/* Markdown 이미지는 크기 정보가 없어 원래와 같이 기본 img로 표시한다. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...props} alt={props.alt ?? ''} />
      </ImageCaption>
    )
  },
  Image: (props: ComponentPropsWithoutRef<typeof Image>) => {
    return (
      <ImageCaption title={props.title}>
        <Image {...props} />
      </ImageCaption>
    )
  },

  // 필요한 다른 컴포넌트들 추가 가능
  // code: ({ className, ...props }: React.ComponentPropsWithoutRef<'code'>) => {
  //   return <code className=" bg-gray-500! text-blue-400! px-[3px]! py-[3px]! rounded-sm! mr-[3px]!" {...props} />
  // },
}
