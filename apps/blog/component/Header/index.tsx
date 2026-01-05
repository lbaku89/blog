import { ThemeToggleBtn } from '../ThemeToggleBtn'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@common-ui/'
import { AdminAuthButton } from '../AdminAuthButton'
import { cookies } from 'next/headers'
import { verifyAdminAuthToken } from '@/lib/auth'
import { ADMIN_COOKIE_NAME } from '@/constant'

export const Header = () => {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value
  const initialIsLoggedIn = verifyAdminAuthToken(token)

  return (
    <header className="flex justify-between items-center py-6 bg-transparent max-w-[1200px] px-4 mx-auto">
      <Link href="/" className="flex justify-start  items-center gap-2">
        <Image src="/avatar.webp" alt="권현우의 프로필 사진" width={40} height={40} className="rounded-full" />
        <h3 className="inline-block text-[16px]">Hyunwoo</h3>
      </Link>
      <div className="flex gap-4 items-center">
        <nav className="flex gap-4 justify-between">
          <ul className="flex list-none">
            <li>
              <Button asChild variant="link">
                <Link href="/pages/1">Post</Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="link">
                <Link href="/about">About</Link>
              </Button>
            </li>
          </ul>
        </nav>
        <AdminAuthButton initialIsLoggedIn={initialIsLoggedIn} />
        <ThemeToggleBtn />
      </div>
    </header>
  )
}
