import { ThemeToggleBtn } from '../ThemeToggleBtn'
import Image from 'next/image'
import Link from 'next/link'

export const Header = () => {
  return (
    <header className="flex justify-between items-center py-6 bg-transparent">
      <div className="flex justify-start  items-center gap-2">
        <Image src="/avatar.webp" alt="권현우의 프로필 사진" width={40} height={40} className="rounded-full" />
        <h3 className="inline-block text-[16px]">hyunu</h3>
      </div>
      <div className="flex gap-10">
        <nav className="flex gap-4 justify-between">
          <ul className="flex gap-4 list-none">
            <li>
              <Link href="/">Post</Link>
            </li>
            <li>
              <Link href="/">About</Link>
            </li>
          </ul>
        </nav>
        <ThemeToggleBtn />
      </div>
    </header>
  )
}
