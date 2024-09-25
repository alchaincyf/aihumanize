import { MetadataRoute } from 'next'
import { db } from '../firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://humanize-ai.top'

  // 静态页面
  const staticPages = [
    '',
    '/pricing',
    '/login',
    '/register',
    '/account',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly' as 'daily' | 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))

  // 动态生成的页面（例如，基于用户生成的内容）
  // 这里我们假设有一个 'posts' 集合，每个文档代表一个公开的帖子
  const postsSnapshot = await getDocs(collection(db, 'posts'))
  const dynamicPages = postsSnapshot.docs.map(doc => ({
    url: `${baseUrl}/post/${doc.id}`,
    lastModified: new Date(doc.data().updatedAt),
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.6,
  }))

  return [...staticPages, ...dynamicPages]
}