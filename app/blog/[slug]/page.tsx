import { getPostBySlug, getRelatedPosts } from '@/lib/api'
import BlogPostClient from './BlogPostClient'  // 移除 .tsx 扩展名

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  
  return {
    title: `${post.title || 'Untitled'} | My Blog`,
    description: post.excerpt || '',
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  const relatedPosts = await getRelatedPosts(params.slug, 3)

  return <BlogPostClient post={post} relatedPosts={relatedPosts} />
}