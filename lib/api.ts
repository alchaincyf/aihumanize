import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';

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
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('![')) {
      // 移除图片标记
      const textOnly = trimmed.replace(/!\[.*?\]\(.*?\)/g, '').trim()
      // 将文本分割成单词
      const words = textOnly.split(/\s+/)
      // 限制单词数量到25个
      if (words.length > 25) {
        return words.slice(0, 25).join(' ') + '...'
      }
      return textOnly
    }
  }
  return ''
}

function generateUniqueSlug(fileName: string, date: string): string {
  const baseSlug = fileName.replace(/\.(md|mdx)$/, '')
  const dateString = new Date(date).toISOString().split('T')[0]
  return `${baseSlug}-${dateString}`
}

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory)
  const slugs = new Set()
  const allPostsData = fileNames
    .filter(fileName => fileName !== '.DS_Store' && /\.(md|mdx)$/.test(fileName))
    .map((fileName) => {
      const slug = generateUniqueSlug(fileName, data.date)
      if (slugs.has(slug)) {
        console.warn(`Duplicate slug found: ${slug}`)
        return null
      }
      slugs.add(slug)

      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      const h1Title = extractH1Title(content)
      const firstParagraph = extractFirstParagraph(content)

      const imageRegex = /!\[.*?\]\((.*?)\)/g;
      const imageMatch = content.match(imageRegex);
      let coverImage: string | null = null;
      if (imageMatch && imageMatch.length > 0) {
        const firstImageMatch = imageMatch[0].match(/\((.*?)\)/);
        if (firstImageMatch && firstImageMatch.length > 1) {
          coverImage = firstImageMatch[1];
        }
      }

      const post = {
        slug,
        ...data,
        date: formatDate(data.date),
        title: h1Title || data.title || formatTitle(fileName),
        excerpt: firstParagraph,
        coverImage: coverImage || data.coverImage || null,
      }

      console.log(`Post ${post.slug} coverImage:`, post.coverImage);
      console.log(`Post ${post.slug} excerpt:`, post.excerpt);

      return post
    })
    .filter(post => post !== null) // 移除重复的帖子

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string) {
  try {
    const decodedSlug = decodeURIComponent(slug)
    const fileNames = fs.readdirSync(postsDirectory)
    const fileName = fileNames.find(file => {
      if (file === '.DS_Store') return false
      const fileNameWithoutExtension = file.replace(/\.(md|mdx)$/, '')
      return fileNameWithoutExtension === decodedSlug || fileNameWithoutExtension.startsWith(decodedSlug)
    })

    if (!fileName) {
      console.error(`No file found for slug: ${decodedSlug}`)
      return null
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
  } catch (error) {
    console.error(`Error in getPostBySlug for slug ${slug}:`, error)
    throw error
  }
}

export async function getRelatedPosts(currentSlug: string, limit: number) {
  const posts = await getAllPosts()
  return posts
    .filter(post => post.slug !== currentSlug)
    .slice(0, limit)
}

export async function getPaginatedPosts(page: number, limit: number) {
  const start = (page - 1) * limit;
  const end = start + limit;
  
  const posts = await getAllPosts();
  return posts.slice(start, end);
}