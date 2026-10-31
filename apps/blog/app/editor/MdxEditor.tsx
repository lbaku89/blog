'use client'

import '@mdxeditor/editor/style.css'
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ButtonWithTooltip,
  CodeToggle,
  CreateLink,
  DiffSourceToggleWrapper,
  GenericJsxEditor,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  Separator,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  insertJsx$,
  jsxPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  usePublisher,
  type JsxComponentDescriptor,
} from '@mdxeditor/editor'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import captionStyles from '@/image-caption.module.css'

/** @description 기존 포스트에서 사용 중인 코드블록 언어 */
const CODE_BLOCK_LANGUAGES = {
  '': 'Plain',
  text: 'Text',
  js: 'JavaScript',
  jsx: 'JSX',
  ts: 'TypeScript',
  tsx: 'TSX',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  bash: 'Bash',
  sh: 'Shell',
  nginx: 'Nginx',
  yaml: 'YAML',
  md: 'Markdown',
}

/** @description mdx-components.tsx 에 등록된 커스텀 컴포넌트 */
const JSX_COMPONENT_DESCRIPTORS: JsxComponentDescriptor[] = [
  {
    name: 'InfoCard',
    kind: 'flow',
    props: [
      { name: 'variant', type: 'string' },
      { name: 'className', type: 'string' },
    ],
    hasChildren: true,
    Editor: GenericJsxEditor,
  },
  {
    name: 'Image',
    kind: 'flow',
    props: [
      { name: 'src', type: 'string' },
      { name: 'alt', type: 'string' },
      { name: 'title', type: 'string' },
      { name: 'width', type: 'expression' },
      { name: 'height', type: 'expression' },
    ],
    hasChildren: false,
    Editor: GenericJsxEditor,
  },
  ...['ProgressBar', 'ProgressBar2', 'ProgressBar3'].map(
    (name): JsxComponentDescriptor => ({ name, kind: 'flow', props: [], hasChildren: false, Editor: GenericJsxEditor })
  ),
  // 그 외 태그도 깨지지 않도록 fallback
  { name: '*', kind: 'flow', props: [], hasChildren: true, Editor: GenericJsxEditor },
]

const InsertInfoCard = () => {
  const insertJsx = usePublisher(insertJsx$)
  return (
    <ButtonWithTooltip
      title="InfoCard 삽입"
      onClick={() =>
        insertJsx({
          name: 'InfoCard',
          kind: 'flow',
          props: { variant: 'info' },
          children: [{ type: 'paragraph', children: [{ type: 'text', value: '내용' }] }],
        })
      }
    >
      <span className="px-1 text-sm font-semibold">InfoCard</span>
    </ButtonWithTooltip>
  )
}

/** @description html.dark 클래스(ThemeToggleBtn)와 에디터 테마 동기화 */
function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const update = () => setIsDark(root.classList.contains('dark'))
    update()

    const observer = new MutationObserver(update)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isDark
}

interface MdxEditorProps {
  readOnly?: boolean
  markdown: string
  onChange: (markdown: string) => void
  onUploadImage: (file: File) => Promise<string>
}

export const MdxEditor = ({ markdown, onChange, onUploadImage, readOnly }: MdxEditorProps) => {
  const isDark = useIsDarkMode()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // MDXEditor는 포스트의 MDX 컴포넌트를 사용하지 않는다. 이미지 decorator 안에
    // 표시 전용 캡션을 추가하되 Lexical 문서와 저장되는 Markdown은 수정하지 않는다.
    const syncCaptions = () => {
      container.querySelectorAll<HTMLElement>('[data-editor-block-type="image"]').forEach((wrapper) => {
        const title = wrapper.querySelector('img')?.getAttribute('title') ?? ''
        const existing = wrapper.querySelector<HTMLElement>('[data-editor-image-caption]')
        // title이 없거나 공백뿐이면 기존 캡션을 제거하고 이 이미지의 처리를 끝낸다.
        if (!title.trim()) {
          existing?.remove()
          return
        }
        // 기존 캡션이 있으면 재사용하고, 없으면 새 span을 생성한다.
        const caption = existing ?? document.createElement('span')
        if (!existing) {
          // 새로 생성한 캡션만 스타일과 편집 불가 속성을 설정하고 이미지 아래에 추가한다.
          caption.dataset.editorImageCaption = ''
          caption.contentEditable = 'false'
          caption.className = captionStyles.caption
          wrapper.append(caption)
        }
        // 새 캡션은 title로 내용을 채우고, 기존 캡션도 title과 다르면 갱신한다.
        // 내용이 같으면 DOM을 수정하지 않아 observer의 불필요한 재실행을 피한다.
        if (caption.textContent !== title) caption.textContent = title
      })
    }

    syncCaptions()
    const observer = new MutationObserver(syncCaptions)
    observer.observe(container, {
      subtree: true, // container 안의 모든 하위 요소까지 감시
      childList: true, // 요소·텍스트 노드가 추가되거나 제거되면 감지
      attributes: true, // HTML 속성 변경도 감시
      attributeFilter: ['title'], // 속성 중에서는 title 변경만 감지
    })
    return () => {
      observer.disconnect()
    }
  }, [])

  const plugins = useMemo(
    () => [
      headingsPlugin(),
      listsPlugin(),
      quotePlugin(),
      thematicBreakPlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      tablePlugin(),
      imagePlugin({ imageUploadHandler: onUploadImage }),
      codeBlockPlugin({ defaultCodeBlockLanguage: 'tsx' }),
      codeMirrorPlugin({ codeBlockLanguages: CODE_BLOCK_LANGUAGES }),
      jsxPlugin({ jsxComponentDescriptors: JSX_COMPONENT_DESCRIPTORS }),
      diffSourcePlugin({ viewMode: 'rich-text' }),
      markdownShortcutPlugin(),
      toolbarPlugin({
        toolbarClassName: 'post-editor-toolbar',
        toolbarContents: () => (
          <DiffSourceToggleWrapper options={['rich-text', 'source']}>
            <UndoRedo />
            <Separator />
            <BlockTypeSelect />
            <BoldItalicUnderlineToggles />
            <CodeToggle />
            <Separator />
            <ListsToggle />
            <CreateLink />
            <InsertImage />
            <InsertTable />
            <InsertCodeBlock />
            <InsertThematicBreak />
            <Separator />
            <InsertInfoCard />
          </DiffSourceToggleWrapper>
        ),
      }),
    ],
    [onUploadImage]
  )

  return (
    <div ref={containerRef}>
      <MDXEditor
        // 이미지 title은 표준 Markdown으로 저장하고, 포스트에서는 캡션으로 표시한다.
        translation={(key, defaultValue) => (key === 'uploadImage.title' ? '캡션 (선택):' : defaultValue)}
        readOnly={readOnly}
        className={isDark ? 'dark-theme post-editor' : 'post-editor'}
        // 실제 포스트 페이지(app/posts/[...slug]/page.tsx)와 동일한 본문 스타일
        contentEditableClassName="prose dark:prose-invert post-wrapper max-w-full min-h-[50vh] pt-[30px]"
        markdown={markdown}
        placeholder="본문을 작성하세요. 이미지는 붙여넣기/드래그하면 R2에 업로드됩니다."
        onChange={(value, initialMarkdownNormalize) => {
          if (!initialMarkdownNormalize) onChange(value)
        }}
        onError={({ error }) =>
          toast.error(`마크다운 파싱 오류: ${error}`, { description: 'Source 모드에서 수정해주세요.' })
        }
        plugins={plugins}
      />
    </div>
  )
}
