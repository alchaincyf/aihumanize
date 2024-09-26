import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'

// 确保这个文件只在服务器端运行
if (typeof window !== 'undefined') {
  throw new Error('This file should only be used on the server side')
}

const postsDirectory = path.join(process.cwd(), 'posts')

function formatDate(date: string | Date | undefined): string {
  if (!date) {
    return 'No date'
  }
  if (typeof date === 'string') {
    return date
  }
  return date.toISOString().split('T')[0]
}

function formatTitle(slug: string): string {
  // 移除数字前缀和文件扩展名
  let title = slug.replace(/^\d+[-.]/, '').replace(/\.(md|mdx)$/, '')
  
  // 将连字符替换为空格
  title = title.replace(/-/g, ' ')
  
  // 将每个单词的首字母大写
  title = title.replace(/\b\w/g, c => c.toUpperCase())
  
  return title
}

function extractH1Title(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : null
}

function extractFirstParagraph(content: string): string {
  const paragraphs = content.split('\n\n')
  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      return trimmed
    }
  }
  return ''
}

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName !== '.DS_Store' && /\.(md|mdx)$/.test(fileName))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      const h1Title = extractH1Title(content)
      const firstParagraph = extractFirstParagraph(content)

      return {
        slug,
        ...data,
        date: formatDate(data.date),
        title: h1Title || data.title || formatTitle(fileName),
        excerpt: firstParagraph || data.excerpt || '',
      }
    })

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug)
  const fileNames = fs.readdirSync(postsDirectory)
  const fileName = fileNames.find(file => {
    if (file === '.DS_Store') return false
    const fileNameWithoutExtension = file.replace(/\.(md|mdx)$/, '')
    return fileNameWithoutExtension === decodedSlug || fileNameWithoutExtension.startsWith(decodedSlug)
  })

  if (!fileName) {
    throw new Error(`No file found for slug: ${decodedSlug}`)
  }

  const fullPath = path.join(postsDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const h1Title = extractH1Title(content)
  const firstParagraph = extractFirstParagraph(content)

  const mdxSource = await serialize(content)

  return {
    slug: decodedSlug,
    content: mdxSource,
    ...data,
    date: formatDate(data.date),
    title: h1Title || data.title || formatTitle(fileName),
    excerpt: firstParagraph || data.excerpt || '',
  }
}

export async function getRelatedPosts(currentSlug: string, limit: number) {
  const posts = await getAllPosts()
  return posts
    .filter(post => post.slug !== currentSlug)
    .slice(0, limit)
}