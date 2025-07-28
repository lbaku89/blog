import { ProgressBar, ProgressBar2, ProgressBar3 } from '@/component/ProgressBar'
import Image from 'next/image'
export const mdxComponents = {
  ProgressBar,
  ProgressBar2,
  ProgressBar3,
  Image: (props: React.ComponentPropsWithoutRef<typeof Image>) => {
    return <Image {...props} />
  },

  // 필요한 다른 컴포넌트들 추가 가능
  // code: ({ className, ...props }: React.ComponentPropsWithoutRef<'code'>) => {
  //   return <code className=" !bg-gray-500 !text-blue-400 !px-[3px] !py-[3px] !rounded-sm !mr-[3px]" {...props} />
  // },
}
