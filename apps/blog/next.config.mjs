/**
 * @reference https://nextjs.org/docs/14/app/building-your-application/configuring/mdx
 */
import createMDX from '@next/mdx'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  // Optionally, add any other Next.js config below
}

export default withMDX(nextConfig)
