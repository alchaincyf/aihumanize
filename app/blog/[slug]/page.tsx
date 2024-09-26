import { getPostBySlug, getRelatedPosts } from '@/lib/api'
import { Typography, Box, Container, Button, Grid } from '@mui/material'
import { MDXRemote } from 'next-mdx-remote/rsc'
import styles from './BlogPost.module.css'
import Link from 'next/link'
import BlogPostCard from '@/app/components/BlogPostCard'
import { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post not found',
    }
  }
  
  return {
    title: `${post.title} | My Blog`, // 添加网站名称以增加品牌认知
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      // 如果有文章封面图，可以在这里添加
      // images: [post.coverImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const post = await getPostBySlug(params.slug)
  const relatedPosts = await getRelatedPosts(params.slug, 3)

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h2" sx={{ fontFamily: 'var(--font-sf-pro-display, sans-serif)', fontWeight: 700 }}>
          Post not found
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <article>
        {/* 移除这里的标题渲染 */}
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontFamily: 'var(--font-sf-pro-text, sans-serif)',
            fontSize: '1rem',
            color: '#86868B',
            mb: 6
          }}
        >
          {post.date}
        </Typography>
        <Box className={styles.mdxContent}>
          <MDXRemote source={post.content} />
        </Box>
      </article>

      <Box sx={{ mt: 8, mb: 6, textAlign: 'center' }}>
        <Link href="/" passHref>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#0071E3',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sf-pro-text, sans-serif)',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#0077ED'
              }
            }}
          >
            Humanize Your Article Now
          </Button>
        </Link>
      </Box>

      {relatedPosts.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontFamily: 'var(--font-sf-pro-display, sans-serif)',
              fontWeight: 600,
              fontSize: '2rem',
              mb: 4,
              color: '#1D1D1F'
            }}
          >
            Related Articles
          </Typography>
          <Grid container spacing={4}>
            {relatedPosts.map((relatedPost, index) => (
              <Grid item xs={12} sm={6} md={4} key={relatedPost.slug}>
                <BlogPostCard post={relatedPost} index={index} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  )
}