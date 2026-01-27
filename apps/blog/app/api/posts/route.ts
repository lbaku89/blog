import { NextResponse } from 'next/server'
import { getAllPosts, getPostsByTag, filterPostsByAdminAccess } from '@/utils/post'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '5', 10)
  const tag = searchParams.get('tag')

  let allPosts = await getAllPosts()
  
  // admin 권한 체크 및 필터링
  const isAdmin = await isAdminAuthenticated()
  allPosts = filterPostsByAdminAccess(allPosts, isAdmin)
  
  // 태그 필터링
  if (tag) {
    allPosts = getPostsByTag(allPosts, tag)
  }
  
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const posts = allPosts.slice(startIndex, endIndex)
  
  // Date 객체를 문자열로 변환하여 JSON 직렬화 가능하게 함
  const serializedPosts = posts.map((post) => ({
    ...post,
    frontMatter: {
      ...post.frontMatter,
      date: post.frontMatter.date.toISOString(),
    },
  }))

  return NextResponse.json({
    posts: serializedPosts,
    hasMore: endIndex < allPosts.length,
    total: allPosts.length,
  })
}
