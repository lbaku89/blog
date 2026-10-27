import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { randomUUID } from 'node:crypto'
import { isValidPostDate, SLUG_REGEX, isEditorEnabled, toPostPath } from '@/lib/editor'
import { uploadToR2 } from '@/lib/r2'

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
const MAX_WIDTH = 1600

/** @description 변환하면 애니메이션/벡터가 깨지는 포맷은 원본 그대로 업로드 */
const PASSTHROUGH_TYPES: Record<string, string> = {
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
}

/**
 * @description URL에 쓰기 편하도록 확장자를 제거하고 영문을 소문자로 변환한다.
 * 한글·공백·특수문자 등 영문 소문자, 숫자, - 이외의 문자는 -로 치환한다.
 * 양 끝의 -를 제거한 뒤 이름이 비어 있으면 image를 사용한다.
 * @example 'My Photo.png' → 'my-photo' / '스크린샷.png' → 'image'
 */
function toSafeName(fileName: string) {
  const name = fileName
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return name || 'image'
}

/**
 * @description 에디터에서 업로드한 이미지를 Cloudflare R2에 저장
 * key: posts/YYYY/MM/{slug}/{파일명}-{고유값}.webp
 */
export async function POST(req: Request) {
  if (!isEditorEnabled) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }

  if (req.headers.get('origin') && req.headers.get('origin') !== new URL(req.url).origin) {
    return NextResponse.json({ error: '다른 출처에서는 업로드할 수 없습니다.' }, { status: 403 })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: '올바른 업로드 형식이 아닙니다.' }, { status: 400 })
  }
  const file = form.get('file')
  const slug = String(form.get('slug') ?? '')
  const date = String(form.get('date') ?? '')

  if (!(file instanceof File) || !file.type.startsWith('image/')) {
    return NextResponse.json({ error: '이미지 파일만 업로드할 수 있습니다.' }, { status: 400 })
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: '20MB 이하의 이미지만 업로드할 수 있습니다.' }, { status: 413 })
  }
  if (!SLUG_REGEX.test(slug) || !isValidPostDate(date)) {
    return NextResponse.json({ error: '이미지를 올리기 전에 slug와 날짜를 먼저 입력해주세요.' }, { status: 400 })
  }

  try {
    const original = Buffer.from(await file.arrayBuffer())
    const passthroughExt = PASSTHROUGH_TYPES[file.type]

    const [body, ext, contentType] = passthroughExt
      ? [original, passthroughExt, file.type]
      : [
          await sharp(original)
            .rotate() // EXIF 회전 정보 반영
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer(),
          'webp',
          'image/webp',
        ]

    const key = `posts/${toPostPath(date, slug)}/${toSafeName(file.name)}-${randomUUID()}.${ext}`
    const url = await uploadToR2(key, body, contentType)

    return NextResponse.json({ url })
  } catch (error) {
    console.error('[editor/upload]', error)
    const message = error instanceof Error ? error.message : '업로드에 실패했습니다.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
