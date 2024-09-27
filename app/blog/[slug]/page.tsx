// @ts-nocheck

import { getPostBySlug, getRelatedPosts } from '@/lib/api'
import BlogPostClient from './BlogPostClient'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = await getPostBySlug(params.slug)
    return {
      title: `${post.title || 'Untitled'} | Humanize AI Blog`,
      description: post.excerpt || '',
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Post Not Found | Blog',
      description: 'The requested post could not be found.',
    }
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  console.log('Attempting to fetch post with slug:', params.slug);
  try {
    const post = await getPostBySlug(params.slug)
    console.log('Post fetched:', post ? 'success' : 'not found');
    if (!post) {
      notFound()
    }
    const relatedPosts = await getRelatedPosts(params.slug, 3)
    console.log('Related posts fetched:', relatedPosts.length);
    return <BlogPostClient post={post} relatedPosts={relatedPosts} />
  } catch (error) {
    console.error('Error fetching post:', error)
    throw error
  }
}