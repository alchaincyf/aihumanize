'use client'

import { useState, useEffect } from 'react'
import { Typography, Box, Container, Button, Grid } from '@mui/material'
import { MDXRemote } from 'next-mdx-remote'
import styles from './BlogPost.module.css'
import Link from 'next/link'
import BlogPostCard from '@/app/components/BlogPostCard'
import ErrorBoundary from '@/app/components/ErrorBoundary'  // 你需要创建这个组件

// 定义 Post 接口
interface Post {
  title: string
  content: string
  // 添加其他必要的属性
}

// 定义 BlogPostClientProps 接口
interface BlogPostClientProps {
  post: Post
  relatedPosts: Post[]
}

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null // 或者返回一个加载指示器
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h2" sx={{ fontFamily: 'var(--font-sf-pro-display, sans-serif)', fontWeight: 700 }}>
          Post not found
        </Typography>
      </Container>
    )
  }

  // 创建一个自定义组件来渲染 MDX 内容，但跳过第一个 h1 标签
  const components = {
    h1: ({ children }) => null, // 这将跳过所有的 h1 标签
  }

  return (
    <ErrorBoundary>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <article>
          <Typography 
            variant="h1" 
            component="h1"
            sx={{ 
              fontFamily: 'var(--font-sf-pro-display, sans-serif)',
              fontWeight: 700,
              fontSize: '2.5rem',
              mb: 2,
              color: '#1D1D1F'
            }}
          >
            {post.title}
          </Typography>
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
            <MDXRemote {...post.content} components={components} />
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
    </ErrorBoundary>
  )
}