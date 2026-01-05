import { NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME } from '@/constant'

export async function POST(req: Request) {
  // 홈으로 돌려보내면서 쿠키 만료
  const res = NextResponse.redirect(new URL('/', req.url))

  res.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    expires: new Date(0), // 과거 날짜 → 즉시 만료
  })

  return res
}
