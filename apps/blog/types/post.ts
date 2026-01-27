export interface FrontMatter {
  title: string
  description: string
  date: string
  published: boolean
  tags: string[]
  adminOnly?: boolean
}
export interface Post {
  frontMatter: Omit<FrontMatter, 'date'> & {
    date: Date
  }
  body: string
  slug: string
  path: string
}
