import { getAllPosts } from '@/lib/api'
import { Typography, Container, Grid } from '@mui/material'
import BlogPostCard from '@/app/components/BlogPostCard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '我的博客 | 精彩文章集锦',
  description: '探索各种有趣的主题和见解',
}

export default async function BlogIndex() {
  const posts = await getAllPosts()

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography 
        variant="h1" 
        component="h1"
        sx={{ 
          fontFamily: 'var(--font-sf-pro-display, sans-serif)',
          fontWeight: 700,
          fontSize: '3rem',
          mb: 6,
          color: '#1D1D1F'
        }}
      >
        Blog
      </Typography>
      <Grid container spacing={4}>
        {posts.map((post, index) => (
          <Grid item xs={12} sm={6} md={4} key={post.slug}>
            <BlogPostCard post={post} index={index} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}