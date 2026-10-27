import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import {
  isValidPostDate,
  SLUG_REGEX,
  getPostFilePath,
  isEditorEnabled,
  isValidPostPath,
  serializePost,
  toPostPath,
  type EditorPost,
} from '@/lib/editor'

/**
 * @description 에디터에서 작성한 포스트를 posts/YYYY/MM/slug.mdx 로 저장
 * - 새 글: 같은 경로에 파일이 있으면 409
 * - 기존 글: slug/날짜(월)가 바뀌면 새 경로로 이동
 */
export async function POST(req: Request) {
  // 1. 배포 서버에서는 파일을 생성하거나 수정할 수 없도록 개발 환경에서만 허용한다.
  if (!isEditorEnabled) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }

  // 2. 다른 웹사이트가 브라우저를 통해 로컬 파일 저장을 유도하는 요청을 차단한다.
  // Origin이 없는 요청은 허용하므로, 다른 컴퓨터의 접근을 막는 인증 수단은 아니다.
  if (req.headers.get('origin') && req.headers.get('origin') !== new URL(req.url).origin) {
    return NextResponse.json({ error: '다른 출처에서는 저장할 수 없습니다.' }, { status: 403 })
  }

  let post: EditorPost
  try {
    // 3. 외부 입력은 TypeScript 타입만으로 보장되지 않으므로 unknown으로 받고 직접 검사한다.
    const value: unknown = await req.json()
    // 필수 필드와 실제 타입을 확인해 잘못된 값이 파일 저장 로직까지 전달되지 않게 한다.
    // 새 글은 원본 경로가 없으므로 path에 null을 허용하고, tags는 내부 값까지 검사한다.
    if (
      !value ||
      typeof value !== 'object' ||
      !('title' in value) ||
      typeof value.title !== 'string' ||
      !('slug' in value) ||
      typeof value.slug !== 'string' ||
      !('date' in value) ||
      typeof value.date !== 'string' ||
      !('path' in value) ||
      (value.path !== null && typeof value.path !== 'string') ||
      !('description' in value) ||
      typeof value.description !== 'string' ||
      !('body' in value) ||
      typeof value.body !== 'string' ||
      !('tags' in value) ||
      !Array.isArray(value.tags) ||
      !value.tags.every((tag) => typeof tag === 'string') ||
      !('published' in value) ||
      typeof value.published !== 'boolean' ||
      !('adminOnly' in value) ||
      typeof value.adminOnly !== 'boolean'
    ) {
      return NextResponse.json({ error: '포스트 입력 형식이 올바르지 않습니다.' }, { status: 400 })
    }
    // 위 검사를 통과한 값을 EditorPost로 취급한다. as 자체가 검증을 수행하지는 않는다.
    post = value as EditorPost
  } catch {
    // JSON을 해석할 수 없는 요청은 서버 오류 대신 입력 오류로 응답한다.
    return NextResponse.json({ error: '올바른 JSON을 보내주세요.' }, { status: 400 })
  }

  // 4. 타입이 맞더라도 저장 가능한 내용인지 별도로 확인한다.
  // 공백뿐인 제목, 파일 경로로 부적합한 slug, 실제로 존재하지 않는 날짜를 거절한다.
  if (!post.title?.trim()) {
    return NextResponse.json({ error: '제목을 입력해주세요.' }, { status: 400 })
  }
  if (!SLUG_REGEX.test(post.slug ?? '')) {
    return NextResponse.json({ error: 'slug는 영문, 숫자, -, _, 괄호만 사용할 수 있습니다.' }, { status: 400 })
  }
  if (!isValidPostDate(post.date)) {
    return NextResponse.json({ error: '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)' }, { status: 400 })
  }
  // 클라이언트가 보낸 원본 경로도 제한해 ../ 같은 값으로 posts 밖의 파일을 지정하지 못하게 한다.
  if (post.path && !isValidPostPath(post.path)) {
    return NextResponse.json({ error: '잘못된 포스트 경로입니다.' }, { status: 400 })
  }

  // 5. 날짜와 slug를 기준으로 저장 위치를 결정한다.
  // isMoved는 새 글(path: null)에서도 true이며, 기존 파일을 덮어써도 되는지 구분할 때 사용한다.
  const targetPath = toPostPath(post.date, post.slug)
  const targetFile = getPostFilePath(targetPath)
  const isMoved = post.path !== targetPath

  // 편집 중 원본이 삭제되거나 이동했다면, 오래된 화면의 내용으로 글을 다시 생성하지 않는다.
  if (post.path && !fs.existsSync(getPostFilePath(post.path))) {
    return NextResponse.json({ error: '원본 포스트가 없습니다. 목록을 새로고침해주세요.' }, { status: 404 })
  }

  // 새 글이나 이동 대상이 다른 글과 겹치면, 해당 글을 덮어쓰지 않고 충돌을 알린다.
  if (isMoved && fs.existsSync(targetFile)) {
    return NextResponse.json({ error: `이미 존재하는 포스트입니다: ${targetPath}` }, { status: 409 })
  }

  // 6. 해당 연도/월 폴더가 없어도 저장할 수 있도록 먼저 생성한다.
  fs.mkdirSync(path.dirname(targetFile), { recursive: true })
  // 메타데이터의 불필요한 공백과 빈 태그를 정리하고, 본문은 공백을 유지한 채 MDX로 저장한다.
  fs.writeFileSync(
    targetFile,
    serializePost({
      title: post.title.trim(),
      description: post.description?.trim() ?? '',
      date: post.date,
      tags: (post.tags ?? []).map((tag) => tag.trim()).filter(Boolean),
      published: Boolean(post.published),
      adminOnly: Boolean(post.adminOnly),
      body: post.body ?? '',
    }),
    // wx는 파일이 이미 생겼다면 실패하므로, 위 중복 검사 직후 다른 요청이 생성한 파일도 보호한다.
    // 기존 글을 같은 경로에 저장할 때만 w로 덮어쓴다.
    { flag: isMoved ? 'wx' : 'w' }
  )

  // 7. 새 위치에 저장이 성공한 뒤에만 원본을 제거해, 쓰기 실패 시 원본을 잃지 않도록 한다.
  if (post.path && isMoved) {
    fs.rmSync(getPostFilePath(post.path), { force: true })
  }

  // 8. 클라이언트가 편집 경로와 저장 상태를 갱신할 수 있도록 최종 경로를 반환한다.
  return NextResponse.json({ path: targetPath })
}
