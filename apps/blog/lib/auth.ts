// crypto 해시 / 암호화 / HMAC 등을 제공하는 표준 라이브러리
import crypto from 'crypto'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME } from '@/constant'

const PASSWORD = process.env.BLOG_ADMIN_PASSWORD!
const SECRET = process.env.BLOG_SESSION_SECRET!

// 세션 토큰 만들기 (로그인 성공 시 사용)
export function createAdminAuthToken() {
  // (1) HMAC (Hash based Message Authentication Code)
  // (2) SHA-256 (Secure Hash Algorithm 256-bit)

  // crypto.createHmac('sha256', SECRET) :SECRET을 이용해 “서명기능”을 하나 만든다
  // .update(PASSWORD) : “PASSWORD를 HMAC key=SECRET으로 서명한다”
  // .digest('hex') : 해시 결과를 16진수 문자열로 변환 (바이너리 → 16진수 문자열 변환)
  return crypto.createHmac('sha256', SECRET).update(PASSWORD).digest('hex')
}

// 쿠키에 들어있는 토큰이 유효한지 검증
export function verifyAdminAuthToken(token?: string | null) {
  if (!token) return false
  const valid = createAdminAuthToken()

  return token === valid

  // 두 버퍼를 항상 “같은 시간 동안” 비교하도록 설계됨
  // 첫 글자에서 틀려도 마지막 글자까지 비교하는 척 함
  // 비교 시간 = “항상 동일”
  // 그래서 “얼마나 맞췄는지”를 시간으로 추측할 수 없음
  // return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(valid))
}

/**
 * @description 서버 사이드에서 현재 요청이 admin 권한을 가지고 있는지 확인
 * @returns admin 권한이 있으면 true, 없으면 false
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  return verifyAdminAuthToken(token)
}
