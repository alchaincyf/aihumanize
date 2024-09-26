import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'

// 确保这个文件只在服务器端运行
if (typeof window !== 'undefined') {
  throw new Error('This file should only be used on the server side')
}

const postsDirectory = path.join(process.cwd(), 'posts')

function formatDate(date: string | Date): string {
  if (typeof date === 'string') {
    return date
  }
  return date.toISOString().split('T')[0]
}

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    return {
      slug,
      ...data,
      date: formatDate(data.date), // 使用新的 formatDate 函数
      title: data.title || '',
      excerpt: data.excerpt || '',
    }
  })

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const mdxSource = await serialize(content)

  return {
    slug,
    content: mdxSource,
    ...data,
    date: formatDate(data.date), // 使用新的 formatDate 函数
    title: data.title || '',
    excerpt: data.excerpt || '',
  }
}

export async function getRelatedPosts(currentSlug: string, limit: number) {
  const posts = await getAllPosts()
  return posts
    .filter(post => post.slug !== currentSlug)
    .slice(0, limit)
}