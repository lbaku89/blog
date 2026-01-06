import { NextResponse } from 'next/server'
import { createAdminAuthToken } from '@/lib/auth'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_MAX_AGE } from '@/constant'

export async function POST(req: Request) {
  const { id, password } = await req.json()

  if (password === process.env.BLOG_ADMIN_PASSWORD && id === process.env.BLOG_ADMIN_ID) {
    const token = createAdminAuthToken()

    const res = NextResponse.json({ ok: true })
    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_COOKIE_MAX_AGE,
    })
    return res
  }

  return NextResponse.json({ ok: false }, { status: 401 })
}
