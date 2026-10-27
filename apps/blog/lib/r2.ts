import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

/**
 * @description Cloudflare R2 (S3 호환 API) 업로드 유틸
 * @reference https://developers.cloudflare.com/r2/api/s3/api/
 */
const R2_ENV_KEYS = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET', 'R2_PUBLIC_URL'] as const

function getR2Env() {
  const missing = R2_ENV_KEYS.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`R2 환경변수가 설정되지 않았습니다: ${missing.join(', ')}`)
  }

  return {
    accountId: process.env.R2_ACCOUNT_ID!,
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    bucket: process.env.R2_BUCKET!,
    publicUrl: process.env.R2_PUBLIC_URL!.replace(/\/+$/, ''),
  }
}

let client: S3Client | null = null

function getClient() {
  if (!client) {
    const { accountId, accessKeyId, secretAccessKey } = getR2Env()
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    })
  }
  return client
}

/**
 * @description R2에 파일을 업로드하고 공개 URL을 반환
 * @param key - 버킷 내 경로 (예: 'posts/2026/09/github-contributions-with-graphql/01.webp')
 */
export async function uploadToR2(key: string, body: Buffer, contentType: string): Promise<string> {
  const { bucket, publicUrl } = getR2Env()

  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      // 파일명에 고유값이 붙으므로 내용이 바뀌지 않음 → 장기 캐시
      CacheControl: 'public, max-age=31536000, immutable',
    })
  )

  return `${publicUrl}/${key}`
}
