import { getPostBySlug, getRelatedPosts } from '@/lib/api'
import BlogPostClient from './BlogPostClient'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = await getPostBySlug(params.slug)
    return {
      title: `${post.title || 'Untitled'} | My Blog`,
      description: post.excerpt || '',
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Post Not Found | My Blog',
      description: 'The requested post could not be found.',
    }
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  try {
    const post = await getPostBySlug(params.slug)
    const relatedPosts = await getRelatedPosts(params.slug, 3)
    return <BlogPostClient post={post} relatedPosts={relatedPosts} />
  } catch (error) {
    console.error('Error fetching post:', error)
    return (
      <div>
        <h1>Post Not Found</h1>
        <p>Sorry, the requested post could not be found.</p>
      </div>
    )
  }
}