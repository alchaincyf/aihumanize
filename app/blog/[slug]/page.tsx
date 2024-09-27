import { getPostBySlug, getAllPosts } from '@/lib/api'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import TableOfContents from './TableOfContents'
import RecommendedPosts from './RecommendedPosts'
import styles from './BlogPost.module.css'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: `${post.title} | Humanize AI Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  const allPosts = await getAllPosts()

  if (!post) {
    notFound()
  }

  return (
    <div className={styles.blogContainer}>
      <TableOfContents content={post.content} />
      <article className={styles.blogPost}>
        <header className={styles.blogHeader}>
          <h1 className={styles.title}>{post.title}</h1>
          <time className={styles.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        </header>
        <div className={styles.content}>
          <MDXRemote 
            source={post.content} 
            options={{
              mdxOptions: {
                rehypePlugins: [
                  rehypeHighlight,
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                ],
              },
            }}
          />
        </div>
        <RecommendedPosts currentSlug={params.slug} allPosts={allPosts} />
      </article>
    </div>
  )
}