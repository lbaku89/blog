import { cookies } from 'next/headers'
import { verifyAdminAuthToken } from '@/lib/auth'
import { ADMIN_COOKIE_NAME } from '@/constant'
import { StickyHeader } from './StickyHeader'

export const Header = () => {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value
  const initialIsLoggedIn = verifyAdminAuthToken(token)

  return <StickyHeader initialIsLoggedIn={initialIsLoggedIn} />
}
