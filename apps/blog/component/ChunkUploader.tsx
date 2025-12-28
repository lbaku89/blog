import { useCallback, useMemo, useRef, useState } from 'react'

type PartState = {
  partNumber: number
  size: number
  pct: number // 이 파트의 실시간 % (XHR onprogress)
  etag?: string
  done?: boolean
  error?: string
}

const MB = 1024 * 1024
const CHUNK_SIZE = 5 * MB
const API = 'http://localhost:4000'

export default function ChunkUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadId, setUploadId] = useState<string | null>(null)
  const [parts, setParts] = useState<PartState[]>([])
  const [overallPct, setOverallPct] = useState(0)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error' | 'canceled'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  // 진행 중인 파트의 XHR를 취소하기 위해 보관
  const currentXhrRef = useRef<XMLHttpRequest | null>(null)
  const canceledRef = useRef(false)

  const totalChunks = useMemo(() => {
    if (!file) return 0
    return Math.ceil(file.size / CHUNK_SIZE)
  }, [file])

  const reset = useCallback(() => {
    setUploadId(null)
    setParts([])
    setOverallPct(0)
    setStatus('idle')
    setMessage(null)
    canceledRef.current = false
  }, [])

  const start = useCallback(async () => {
    if (!file) return
    reset()
    setStatus('uploading')

    try {
      // 1) 업로드 세션 시작
      const initRes = await fetch(`${API}/multipart/initiate`, { method: 'POST' })
      if (!initRes.ok) throw new Error('initiate failed')
      const { uploadId } = await initRes.json()
      setUploadId(uploadId)

      // 초기 파트 배열 세팅
      const partStates: PartState[] = []
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE
        const size = Math.min(CHUNK_SIZE, file.size - start)
        partStates.push({ partNumber: i + 1, size, pct: 0 })
      }
      setParts(partStates)

      // 2) 파트 업로드 루프
      let uploadedBytes = 0
      const completedParts: { ETag: string; PartNumber: number }[] = []

      for (let i = 0; i < totalChunks; i++) {
        if (canceledRef.current) throw new DOMException('aborted', 'AbortError')

        const partNumber = i + 1
        const offset = i * CHUNK_SIZE
        const chunk = file.slice(offset, Math.min(offset + CHUNK_SIZE, file.size))

        // 2-1) (모킹에선 바로 PUT하면 됨. 서명 URL 분리하고 싶으면 /multipart/part 호출 추가)
        const url = `${API}/multipart/upload/${uploadId}/${partNumber}`

        const etag = await putPartWithXHR(url, chunk, (loaded, total) => {
          // 파트 내부 진행률 갱신 (부드러운 %)
          setParts((prev) =>
            prev.map((p) => (p.partNumber === partNumber ? { ...p, pct: Math.floor((loaded / total) * 100) } : p))
          )
        })

        // 파트 완료 후 전체 누적 바이트 + 전체 % 갱신
        uploadedBytes += chunk.size
        setOverallPct(Math.floor((uploadedBytes / file.size) * 100))

        // 파트 완료 마킹
        setParts((prev) => prev.map((p) => (p.partNumber === partNumber ? { ...p, pct: 100, etag, done: true } : p)))

        completedParts.push({ ETag: etag, PartNumber: partNumber })
      }

      // 3) complete
      const compRes = await fetch(`${API}/multipart/complete`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ uploadId, parts: completedParts, filename: file.name }),
      })
      if (!compRes.ok) throw new Error('complete failed')

      setStatus('done')
      setMessage('업로드 완료')
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        setStatus('canceled')
        setMessage('사용자 취소')
      } else {
        setStatus('error')
        setMessage(e?.message || '업로드 실패')
      }
    } finally {
      // 현재 진행 중이던 XHR 참조 제거
      currentXhrRef.current = null
    }
  }, [API, file, reset, totalChunks, uploadId])

  const cancel = useCallback(() => {
    canceledRef.current = true
    currentXhrRef.current?.abort()
  }, [])
  /** XHR 기반 PUT (업로드 진행률 콜백 포함) */
  function putPartWithXHR(
    url: string,
    blob: Blob,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      currentXhrRef.current = xhr

      xhr.open('PUT', url)
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) onProgress(e.loaded, e.total)
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          currentXhrRef.current = null // 이 파트 완료
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.getResponseHeader('ETag') || '')
          } else {
            reject(new Error(`part upload failed: ${xhr.status}`))
          }
        }
      }
      xhr.onerror = () => reject(new Error('network error'))
      xhr.onabort = () => reject(new DOMException('aborted', 'AbortError'))
      xhr.send(blob)
    })
  }

  return (
    <div className="card">
      <h2>XHR 멀티파트 업로드 (5MB 청크)</h2>
      <div className="row">
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button onClick={start} disabled={!file || status === 'uploading'}>
          업로드 시작
        </button>
        <button onClick={cancel} disabled={status !== 'uploading'}>
          취소
        </button>
        <button onClick={reset}>초기화</button>
      </div>

      <div className="row">
        상태: <b>{status}</b> {message ? `· ${message}` : ''}
      </div>
      <div className="row">
        전체 진행률: <b>{overallPct}%</b>
      </div>
      <Progress value={overallPct} />

      {!!parts.length && (
        <div className="parts">
          {parts.map((p) => (
            <div className="part" key={p.partNumber}>
              <div className="part__meta">
                Part {p.partNumber} ({(p.size / MB).toFixed(1)}MB)
              </div>
              <Progress value={p.pct} />
              <div className="part__status">{p.done ? 'done' : p.error ? `error: ${p.error}` : `${p.pct}%`}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Progress({ value }: { value: number }) {
  return (
    <div
      style={{
        height: 10,
        background: '#eee',
        borderRadius: 6,
        overflow: 'hidden',
        margin: '6px 0',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${Math.max(0, Math.min(100, value))}%`,
          background: '#3b82f6',
          transition: 'width .1s linear',
        }}
      />
    </div>
  )
}
