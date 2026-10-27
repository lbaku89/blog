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
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

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
    <MDXEditor
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
  )
}
