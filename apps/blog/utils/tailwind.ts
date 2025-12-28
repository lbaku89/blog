import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * @description clsx - 조건부 tailwind css 적용 , twMerge - 중복 항목에 대한 css 충돌 해결 ( overriding )
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}
